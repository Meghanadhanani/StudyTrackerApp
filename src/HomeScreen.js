import { StyleSheet, Text, View, TouchableOpacity, ScrollView, SafeAreaView, Platform, Modal, TextInput, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import StorageUtils from './common/StorageUtils';
import SplashIllustration from './assets/SplashIllustration';
import { NOTES } from './API/APIHelper';
import axios from 'axios';
const {width} = Dimensions.get('window');

const NoteCard = ({ id, title, lectures = [], totalLectures = 0, completedLectures = [], subject, date, onToggleLecture, onEdit, onDelete, onPress }) => {
  const [expanded, setExpanded] = useState(false);

  const initialVisibleLectures = 6;
  const hasMoreLectures = lectures?.length > initialVisibleLectures;
  const displayedLectures = expanded ? lectures : lectures?.slice(0, initialVisibleLectures);

  const calculateProgress = () => {
    if (!completedLectures || !totalLectures) return 0;
    return Math.round(((completedLectures?.length || 0) / (totalLectures || 1)) * 100);
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
    // Validate required fields
    if (!title.trim()) {
        Alert.alert('Error', 'Title is required');
        return;
    }

    // Filter out empty lectures and ensure it's an array
    const filteredLectures = lectures.filter(lec => lec && lec.trim() !== '');
    const totalLecturesValue = parseInt(totalLectures) || filteredLectures.length;

    if (totalLecturesValue <= 0) {
        Alert.alert('Error', 'Total lectures must be greater than 0');
        return;
    }

    const noteData = {
        title: title.trim(),
        lectures: filteredLectures,
        totalLectures: totalLecturesValue,
        subject: subject.trim() || 'Unknown',
        completedLectures: [], // Always empty for new notes
        date: new Date().toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        })
    };

    // Remove the client-side generated ID as the server will assign one
    if (editNote?.id) {
        noteData.id = editNote.id;
    }

    console.log("Submitting note data:", noteData);
    onAdd(noteData);
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
  const [username, setUsername] = useState('');

  // Load notes when component mounts
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const token = await StorageUtils.getToken();
      console.log("Fetching notes from:", NOTES);
      const response = await axios.get(NOTES, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Response from API:", response.data);

      if (response.data.success) {
        setNotes(response.data.notes); // Assuming the API returns notes in 'notes' array
      } else {
        console.warn("API response success is false:", response.data);
      }
    } catch (error) {
      console.error("Error loading notes:", error);
      Alert.alert("Error", "Failed to load notes");
    }
  };
  const handleAddOrUpdate = async (noteData) => {
    try {
        const token = await StorageUtils.getToken();
        
        // Clean up the data
        const formattedData = {
            title: noteData.title.trim(),
            lectures: noteData.lectures.map(lec => lec.trim()).filter(lec => lec.length > 0),
            totalLectures: parseInt(noteData.totalLectures),
            subject: noteData.subject.trim(),
            completedLectures: [], // Initialize empty for new notes
            date: new Date().toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            })
        };

        // If editing an existing note
        if (noteData.id && editingNote) {
            const response = await axios.put(
                `${NOTES}/${noteData.id}`, 
                formattedData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            if (response.data.success) {
                setNotes(prevNotes => 
                    prevNotes.map(note => 
                        note.id === noteData.id ? response.data.note : note
                    )
                );
                setModalVisible(false);
                setEditingNote(null);
            }
        } 
        // If creating a new note
        else {
            const response = await axios.post(
                NOTES, 
                formattedData,
                {
                    headers: { 
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            if (response.data.success) {
                setNotes(prevNotes => [...prevNotes, response.data.note]);
                setModalVisible(false);
                setEditingNote(null);
            }
        }
        
    } catch (error) {
        console.error('Error details:', error.response?.data || error.message);
        Alert.alert(
            'Error',
            error.response?.data?.message || 'Failed to save note. Please try again.'
        );
    }
};

  const handleDelete = async (noteId) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const token = await StorageUtils.getToken();
              const response = await axios.delete(`${NOTES}/${noteId}`, {
                headers: { Authorization: `Bearer ${token}` },
              });

              if (response.data.success) {
                const updatedNotes = notes.filter(note => note.id !== noteId);
                setNotes(updatedNotes);
              }
            } catch (error) {
              console.error('Error deleting note:', error);
              Alert.alert('Error', 'Failed to delete note');
            }
          }
        }
      ]
    );
  };

  const toggleLecture = async (noteId, lectureIndex) => {
    try {
      const note = notes.find(n => n.id === noteId);
      const completedLectures = note.completed_lectures.includes(lectureIndex)
        ? note.completed_lectures.filter(i => i !== lectureIndex)
        : [...note.completed_lectures, lectureIndex];

      const token = await StorageUtils.getToken();
      const response = await axios.put(
        `${NOTES}/${noteId}`,
        { ...note, completedLectures },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedNotes = notes.map(n =>
          n.id === noteId ? response.data.note : n
        );
        setNotes(updatedNotes);
      }
    } catch (error) {
      console.error('Error updating lecture status:', error);
      Alert.alert('Error', 'Failed to update lecture status');
    }
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userInfo = await StorageUtils.getUserInfo();
      if (userInfo && userInfo.username) {
        setUsername(userInfo.username);
      }
    };

    fetchUserInfo();
  }, []);

  const saveNotes = async (updatedNotes) => {
    try {
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        {/* Header Section */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row' }}>
            <Icon name="user" size={24} color="#333" />
            <View style={{ marginLeft: 10 }}>
              <Text style={{ fontSize: 18 }}>Good Morning</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{username}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Icon name="search1" size={24} color="#FF7466" />
            </TouchableOpacity>
            <TouchableOpacity style={{ marginLeft: 10 }}>
              <Icon name="bells" size={24} color="#FF7466" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Notes Section */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 20 }}>Notes</Text>

        <ScrollView style={{ marginTop: 10 }}>
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              {...note}
              onToggleLecture={toggleLecture}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onPress={() => navigation.navigate('NoteDetail', {
                note,
                onUpdate: (updatedNote) => {
                  const updatedNotes = notes.map(n =>
                    n.id === updatedNote.id ? updatedNote : n
                  );
                  setNotes(updatedNotes);
                  saveNotes(updatedNotes);
                }
              })}
            />
          ))}

          {/* Add Note Button */}
          <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => setModalVisible(true)}>
            <Icon name="plus" size={20} color="#4B9F89" />
            <Text style={{ marginLeft: 10, fontSize: 18 }}>Add New Note</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* Empty Notes Illustration */}
        {notes.length < 1 && (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 50 }}>
            <SplashIllustration width={width * 0.85} height={width * 0.85} />
          </View>
        )}
      </View>

      {/* Add/Edit Note Modal */}
      <AddNoteModal
        visible={modalVisible}
        onClose={closeModal}
        onAdd={handleAddOrUpdate}
        editNote={editingNote}
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

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
  },  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 50,
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
  // eslint-disable-next-line no-dupe-keys
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
    color:"#121212"
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
    color:"#121212"
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
    fontSize: 16,
  },
  dateText: {
    color: '#666',
    fontSize: 12,
  },
});

