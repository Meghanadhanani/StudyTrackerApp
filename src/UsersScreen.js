import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { USERDETAILS } from './API/APIHelper';

const UsersScreen = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(USERDETAILS);
                console.log(response);
                
                setUsers(response.data);
            } catch (error) {
                console.log("helloooooo----", error);
                
                setLoading(false); 
            }
        };

        fetchUsers();
    }, []); 

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    

    return (
        <View style={{ flex: 1, padding: 20 }}>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={{ marginBottom: 10 }}>
                        <Text>{item.email}</Text> 
                    </View>
                )}
            />
        </View>
    );
};

export default UsersScreen;
