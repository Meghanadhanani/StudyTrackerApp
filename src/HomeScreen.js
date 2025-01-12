import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Platform, Modal, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const NoteCard = ({ id, title, lectures, totalLectures, completedLectures, subject, date, onToggleLecture, onEdit, onDelete, onPress }) => {
  const [expanded, setExpanded] = useState(false);
  const initialVisibleLectures = 6;
  const hasMoreLectures = lectures.length > initialVisibleLectures;
  
  const displayedLectures = expanded ? lectures : lectures.slice(0, initialVisibleLectures);
  
  const calculateProgress = () => {
    return Math.round((completedLectures.length / totalLectures) * 100);
  };

  return (
    <View style={styles.noteCard}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle} numberOfLines={1}>{title}</Text>
          <View style={styles.headerButtons}>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onEdit(id);
              }} 
              style={styles.editButton}
            >
              <Icon name="edit" size={20} color="#4B9F89" />
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={(e) => {
                e.stopPropagation();
                onDelete(id);
              }} 
              style={styles.deleteButton}
            >
              <Icon name="delete" size={20} color="#FF7466" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${calculateProgress()}%` }]} />
          </View>
          <Text style={styles.progressText}>{calculateProgress()}% Complete</Text>
        </View>
        
        <View style={styles.lecturesGrid}>
          {displayedLectures.map((lec, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.lectureItem}
              onPress={(e) => {
                e.stopPropagation();
                onToggleLecture(id, index);
              }}
            >
              <Icon 
                name={completedLectures.includes(index) ? "checkcircle" : "checkcircleo"} 
                size={16} 
                color="#4B9F89" 
              />
              <Text style={styles.lectureText} numberOfLines={1}>{lec}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {hasMoreLectures && (
          <TouchableOpacity 
            style={styles.showMoreButton}
            onPress={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            <Text style={styles.showMoreText}>
              {expanded ? 'Show Less' : `Show More (${lectures.length - initialVisibleLectures} left)`}
            </Text>
            <Icon 
              name={expanded ? "up" : "down"} 
              size={12} 
              color="#4B9F89" 
            />
          </TouchableOpacity>
        )}
        
        <View style={styles.cardFooter}>
          <View style={styles.tagContainer}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{completedLectures.length}/{totalLectures} Lectures</Text>
            </View>
            <View style={styles.tag}>
              <Text style={styles.tagText}>{subject}</Text>
            </View>
          </View>
          <Text style={styles.dateText}>{date}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};


const AddNoteModal = ({ visible, onClose, onAdd, editNote = null }) => {
  const [title, setTitle] = useState(editNote?.title || '');
  const [lectures, setLectures] = useState(editNote?.lectures || ['']);
  const [totalLectures, setTotalLectures] = useState(editNote?.totalLectures?.toString() || '');
  const [subject, setSubject] = useState(editNote?.subject || '');
  useEffect(() => {
    if (editNote) {
      setTitle(editNote.title || '');
      setLectures(editNote.lectures || ['']);
      setTotalLectures(editNote.totalLectures?.toString() || '');
      setSubject(editNote.subject || '');
    } else {
      resetForm();
    }
  }, [editNote, visible]);
  const handleSubmit = () => {
    const noteData = {
      id: editNote?.id || Date.now(),
      title,
      lectures: lectures.filter(lec => lec.trim() !== ''),
      totalLectures: parseInt(totalLectures),
      completedLectures: editNote?.completedLectures || [],
      subject,
      date: editNote?.date || new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    };

    onAdd(noteData);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setTitle('');
    setLectures(['']);
    setTotalLectures('');
    setSubject('');
  };

  const addLecture = () => setLectures([...lectures, '']);
  
  const updateLecture = (text, index) => {
    const newLectures = [...lectures];
    newLectures[index] = text;
    setLectures(newLectures);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {editNote ? 'Edit Note' : 'Create New Note'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter note title"
                value={title}
                onChangeText={setTitle}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Total Lectures</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter total number of lectures"
                value={totalLectures}
                onChangeText={setTotalLectures}
                keyboardType="numeric"
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter subject name"
                value={subject}
                onChangeText={setSubject}
                placeholderTextColor="#999"
              />
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.lectureHeader}>
                <Text style={styles.inputLabel}>Lectures</Text>
                <TouchableOpacity style={styles.addLectureButton} onPress={addLecture}>
                  <Icon name="plus" size={16} color="#4B9F89" />
                  <Text style={styles.addLectureText}>Add Lecture</Text>
                </TouchableOpacity>
              </View>
              
              {lectures.map((lecture, index) => (
                <View key={index} style={styles.lectureInput}>
                  <Text style={styles.lectureNumber}>{index + 1}</Text>
                  <TextInput
                    style={styles.lectureTitleInput}
                    placeholder={`Enter lecture ${index + 1} title`}
                    value={lecture}
                    onChangeText={(text) => updateLecture(text, index)}
                    placeholderTextColor="#999"
                  />
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.submitButton, !title && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={!title}
            >
              <Text style={styles.submitButtonText}>
                {editNote ? 'Update Note' : 'Create Note'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen = () => {
  const navigation = useNavigation();
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const savedNotes = await AsyncStorage.getItem('notes');
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleAddOrUpdate = (noteData) => {
    const updatedNotes = editingNote 
      ? notes.map(note => note.id === noteData.id ? noteData : note)
      : [...notes, noteData];
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setEditingNote(null);
  };

  const handleDelete = (noteId) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            saveNotes(updatedNotes);
          }
        }
      ]
    );
  };

  const toggleLecture = (noteId, lectureIndex) => {
    const updatedNotes = notes.map(note => {
      if (note.id === noteId) {
        const completedLectures = note.completedLectures.includes(lectureIndex)
          ? note.completedLectures.filter(i => i !== lectureIndex)
          : [...note.completedLectures, lectureIndex];
        return { ...note, completedLectures };
      }
      return note;
    });
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const handleEdit = (noteId) => {
    const noteToEdit = notes.find(note => note.id === noteId);
    setEditingNote(noteToEdit);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingNote(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Icon name="user" size={24} color="#333" />
            </View>
            <View style={styles.greeting}>
              <Text style={styles.greetingText}>Good Morning</Text>
              <Text style={styles.nameText}>Mr. C.A.</Text>
            </View>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="search1" size={24} color="#FF7466" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Icon name="bells" size={24} color="#FF7466" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>Notes</Text>

        <ScrollView 
          style={styles.notesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {notes.map((note) => (
            <NoteCard 
              key={note.id} 
              {...note} 
              onToggleLecture={toggleLecture}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPress={() => navigation.navigate('NoteDetail', { note })}
            />
          ))}

          <TouchableOpacity 
            style={styles.addNoteButton}
            onPress={() => setModalVisible(true)}
          >
            <Icon name="plus" size={20} color="#4B9F89" />
            <Text style={styles.addNoteText}>Add New Note</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>

        <AddNoteModal
          visible={modalVisible}
          onClose={closeModal}
          onAdd={handleAddOrUpdate}
          editNote={editingNote}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'ios' ? 0 : 30,
    marginBottom: 30,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#FFE3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  greeting: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 14,
    color: '#666',
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  notesContainer: {
    flex: 1,
  }, cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 5,
  },
  scrollContent: {
    paddingBottom: 90, // Adds space for the tab bar
  },
  noteCard: {
    backgroundColor: '#EAF5F2',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  lectureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  lectureText: {
    color: '#666',
    fontSize: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#4B9F89',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
  addNoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#4B9F89',
    borderStyle: 'dashed',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
    gap: 8,
  },
  addNoteText: {
    color: '#4B9F89',
    fontSize: 16,
    fontWeight: '500',
  },
  bottomPadding: {
    height: 80, // Extra padding at the bottom to ensure last item is visible above tab bar
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  addLectureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  addLectureText: {
    color: '#4B9F89',
    fontSize: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    padding: 12,
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#4B9F89',
    padding: 12,
    borderRadius: 8,
  },
  addButtonDisabled: {
    backgroundColor: '#ccc',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end', // Modal slides from bottom
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  lectureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addLectureButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
  },
  addLectureText: {
    color: '#4B9F89',
    fontSize: 14,
    fontWeight: '500',
  },
  lectureInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  lectureNumber: {
    width: 24,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '500',
    color: '#666',
  },
  lectureTitleInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f8f8f8',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#4B9F89',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deleteButton: {
    padding: 5,
  },  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  editButton: {
    padding: 5,
  },
  deleteButton: {
    padding: 5,
  },
  noteCard: {
    backgroundColor: '#EAF5F2',
    borderRadius: 15,
    padding: 16,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: '#D1E8E2',
    borderRadius: 3,
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4B9F89',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  lecturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  lectureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    gap: 6,
    width: '48%',
  },
  lectureText: {
    color: '#666',
    fontSize: 14,
    flex: 1,
  },
  showMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  showMoreText: {
    color: '#4B9F89',
    fontSize: 14,
    fontWeight: '500',
    // width:"100%",
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    backgroundColor: '#4B9F89',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: 'white',
    fontSize: 12,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
});

export default HomeScreen;