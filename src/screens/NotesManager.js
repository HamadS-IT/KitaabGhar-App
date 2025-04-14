/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { View,
         Text,
         TextInput,
         TouchableOpacity,
         Modal,
         ScrollView,
         Alert,
        KeyboardAvoidingView,
        Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/NotesMangerStyles'; // Use your styles file

const NotesManager = ({ visible, onClose, bookID, pageNo }) => {
    const [notes, setNotes] = useState([]); // List of notes
    const [addNoteModalVisible, setAddNoteModalVisible] = useState(false); // Add note modal visibility
    const [newNoteTitle, setNewNoteTitle] = useState(''); // New note title
    const [newNoteContent, setNewNoteContent] = useState(''); // New note content
    const [noteDetailModalVisible, setNoteDetailModalVisible] = useState(false); // Note detail modal visibility
    const [selectedNote, setSelectedNote] = useState(null); // Selected note for detail view and editing
    const [isEditing, setIsEditing] = useState(false); // Flag to check if note is in editing mode

    // Fetch notes when the modal is visible
    useEffect(() => {
        if (visible) {
            fetchNotes();
        }
    }, [visible]);

    const fetchNotes = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`/notes/getNotes/${bookID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                // setNotes(response.data.notes);
                setNotes(response.data.notes.filter((note) => note.currentPage === pageNo));
            } else {
                Alert.alert('Error','Failed to fetch notes.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error','An error occurred while fetching notes.');
        }
    };

    const handleAddNote = async () => {
        if (!newNoteTitle.trim() || !newNoteContent.trim()) {
            Alert.alert('Error','Please fill in all fields.');
            return;
        }

        const noteData = {
            bookId: bookID,
            currentPage: pageNo,
            noteTitle: newNoteTitle,
            noteContent: newNoteContent,
        };

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post('/notes/addNote', noteData, {
                headers: { Authorization: `Bearer ${token}` }}); // Replace with your backend URL
            if (response.status === 201) {
                setNotes([...notes, response.data.note]);
                setAddNoteModalVisible(false);
                setNewNoteTitle('');
                setNewNoteContent('');
                Alert.alert('Success','Note added successfully!');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error','Failed to add note. Please try again.');
        }
    };

    const handleNoteClick = (note) => {
        setSelectedNote(note);
        setNoteDetailModalVisible(true);
        setIsEditing(false); // Reset editing mode when opening a note
    };

    const handleEditNote = () => {
        setIsEditing(true); // Enable editing
    };

    const handleSaveEdit = async () => {
        if (!selectedNote?.noteTitle || !selectedNote?.noteContent) {
            Alert.alert('Error','Please fill in all fields before saving.');
            return;
        }

        const updatedNoteData = {
            noteID:selectedNote._id.toString(),
            noteTitle: selectedNote.noteTitle,
            noteContent: selectedNote.noteContent, // Ensure this value is correct
        };

        try {
            // Make sure the URL matches your backend route
            const token = await AsyncStorage.getItem('token');
            const response = await axios.put('/notes/updateNote', updatedNoteData, {
                headers: { Authorization: `Bearer ${token}` }});

            if (response.status === 200) {
                const updatedNotes = notes.map((note) =>
                    note._id.toString() === selectedNote._id.toString()
                        ? { ...note, noteTitle: selectedNote.noteTitle, noteContent: selectedNote.noteContent }
                        : note
                );
                setNotes(updatedNotes);
                setIsEditing(false);
                Alert.alert('Success','Note updated successfully!');
            } else {
                console.log('Error: ' + response.data.message);
                Alert.alert('Error','Failed to update note.');
            }
        } catch (error) {
            console.error('Error in axios request:', error.response ? error.response.data : error.message);
            if (error.response) {
                Alert.alert('Error',`${error.response.data.message || error.response.statusText}`);
            } else {
                Alert.alert('Error','An error occurred while updating the note.');
            }
        }
    };

    const handleDeleteNote = async () => {
        if (!selectedNote) {return;}

        const deleteNoteData = {
            noteID:selectedNote._id.toString(),
        };

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.delete('/notes/deleteNote', {
                data: deleteNoteData,
                headers: { Authorization: `Bearer ${token}` }});

            if (response.status === 200) {
                setNotes(notes.filter((note) => note._id.toString() !== selectedNote._id.toString()));
                setNoteDetailModalVisible(false);
                setSelectedNote(null);
                Alert.alert('Success','Note deleted successfully!');
            } else {
                Alert.alert('Error','Failed to delete note.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error','An error occurred while deleting the note.');
        }
    };

    return (
        <>
            {/* Notes Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={visible}
                onRequestClose={onClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.notesModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Notes</Text>
                            <TouchableOpacity onPress={onClose}>
                                <Icon name="close" size={20} style={styles.closeIcon} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView style={styles.notesList}>
                            {notes.map((note, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.noteItem}
                                    onPress={() => handleNoteClick(note)} // Show note details
                                >
                                    <Icon name="bookmark" size={24} color="#5BA191" />
                                    <Text style={styles.noteItemTitle}>{note.noteTitle}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                        <TouchableOpacity
                            style={styles.addNoteButton}
                            onPress={() => setAddNoteModalVisible(true)}
                        >
                            <Text style={styles.addNoteButtonText}>Add Note</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Add Note Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={addNoteModalVisible}
                onRequestClose={() => setAddNoteModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.addNoteModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Add Note</Text>
                            <TouchableOpacity onPress={() => setAddNoteModalVisible(false)}>
                                <Icon name="close" size={20} style={styles.closeIcon} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                        <View style={styles.addNotesForm}>
                        <Text style={styles.addNotesFormLabel} >Note Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Add Note Title..."
                            value={newNoteTitle}
                            onChangeText={setNewNoteTitle}
                        />
                        <Text style={styles.addNotesFormLabel} >Note Content</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add Note Content..."
                            value={newNoteContent}
                            onChangeText={setNewNoteContent}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.saveButton}
                                onPress={handleAddNote}
                            >
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setAddNoteModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                        </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Note Detail Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={noteDetailModalVisible}
                onRequestClose={() => setNoteDetailModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.notesModal}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{ 'Note Details' }</Text>
                            <TouchableOpacity onPress={() => setNoteDetailModalVisible(false)} style={styles.closeButton}>
                                <Icon name="close" size={20} color="#FFF" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                        <View style={styles.addNotesForm}>
                        <Text style={styles.addNotesFormLabel} >Note Title</Text>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        >
                        <TextInput
                            style={styles.input}
                            placeholder="Add Note Title..."
                            value={selectedNote?.noteTitle}
                            onChangeText={(text) =>
                                setSelectedNote({ ...selectedNote, noteTitle: text })
                            }
                            editable={isEditing}
                        />
                        </KeyboardAvoidingView>
                        <Text style={styles.addNotesFormLabel} >Note Content</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Add Note Content..."
                            value={selectedNote?.noteContent}
                            onChangeText={(text) =>
                                setSelectedNote({ ...selectedNote, noteContent: text })
                            }
                            editable={isEditing}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            {!isEditing ? (
                                <TouchableOpacity style={styles.editButton} onPress={handleEditNote}>
                                    <Text style={styles.editButtonText}>Edit</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity style={styles.saveChangesButton} onPress={handleSaveEdit}>
                                    <Text style={styles.saveChangesText}>Save Changes</Text>
                                </TouchableOpacity>
                            )}
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={handleDeleteNote}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </ScrollView>
                    </View>
               </View>
            </Modal>
        </>
    );
};

export default NotesManager;
