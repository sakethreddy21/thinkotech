import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, Pressable, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
interface InputField {
  name: string;
  label: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
}

interface CustomModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  inputs: InputField[];
  onSubmit: (values: { [key: string]: string }) => void;
  submitButtonTitle: string;
  initialValues?: { [key: string]: string };
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  onClose,
  title,
  inputs,
  onSubmit,
  submitButtonTitle,
  initialValues,
}: CustomModalProps) => {
  // Initialize inputValues based on inputs prop and initialValues
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>(() =>
    inputs.reduce((acc: { [key: string]: string }, input: InputField) => {
      acc[input.name] = initialValues ? String(initialValues[input.name] || '') : '';
      return acc;
    }, {})
  );

  // Update inputValues when initialValues change, applying only the required fields
  useEffect(() => {
    if (initialValues) {
      setInputValues((prevState: { [key: string]: string }) =>
        inputs.reduce((acc: { [key: string]: string }, input: InputField) => {
          acc[input.name] = String(initialValues[input.name] || '');
          return acc;
        }, {})
      );
    }
  }, [initialValues, inputs]);

  // Handle input field change
  const handleInputChange = (name: string, value: string) => {
    setInputValues((prevState: { [key: string]: string }) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>{title}</Text>
          {inputs.map((input, index) => (
            <TextInput
              key={index}
              style={styles.input}
              placeholder={input.label}
              value={inputValues[input.name] || ''} // Convert to string if needed
              onChangeText={(value) => handleInputChange(input.name, value)}
              keyboardType={input.keyboardType || 'default'}
              placeholderTextColor="grey"
            />
          ))}
          <View style={{ display: 'flex', flexDirection: 'row', gap: 20 }}>
            
            <Button
                icon="plus"
                mode="contained"
                onPress={() => onSubmit(inputValues)}
                style={styles.button}
              >   {submitButtonTitle}
              </Button>
            
            <Button
                icon="cancel"
                mode="contained"
                onPress={onClose} // Update status
                style={styles.cancelButton}
              >   Cancel
              </Button>
            
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 300,
    paddingLeft: 8,
    color: 'grey',
    borderRadius: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  cancelButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    backgroundColor: 'red', // Default color
    display:'flex',
    justifyContent:'center',
    alignItems:'center'
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default CustomModal;
