import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import * as Contacts from 'expo-contacts';
import {Ionicons} from '@expo/vector-icons';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {styled} from 'nativewind';

interface ContactListModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectContact: (contact: Contacts.Contact) => void;
}

interface ContactPhone {
  number?: string;
}

const StyledKeyboardAwareScrollView = styled(KeyboardAwareScrollView);

const ContactListModal: React.FC<ContactListModalProps> = ({
  visible,
  onClose,
  onSelectContact,
}) => {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contacts.Contact[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const {status} = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
          const {data} = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
          });

          const sortedContacts = data.sort(
            (a: Contacts.Contact, b: Contacts.Contact) => {
              return (a.name || '').localeCompare(b.name || '');
            },
          );

          setContacts(sortedContacts);
          setFilteredContacts(sortedContacts);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    const filtered = contacts.filter(contact => {
      const searchLower = searchQuery.toLowerCase();
      return (
        contact.name?.toLowerCase().includes(searchLower) ||
        contact.phoneNumbers?.some((phone: ContactPhone) =>
          phone.number?.toLowerCase().includes(searchLower),
        )
      );
    });
    setFilteredContacts(filtered);
  }, [searchQuery, contacts]);

  const renderContact = ({item}: {item: Contacts.Contact}) => (
    <TouchableOpacity
      className="flex-row p-4 items-center border-b border-gray-200"
      onPress={() => onSelectContact(item)}>
      <View className="w-[50px] h-[50px] rounded-full bg-gray-200 items-center justify-center">
        <Text className="text-xl font-semibold text-gray-600">
          {item.name?.[0]?.toUpperCase() || '?'}
        </Text>
      </View>
      <View className="ml-4 flex-1">
        <Text className="text-base font-medium">{item.name}</Text>
        {item.phoneNumbers && item.phoneNumbers[0] && (
          <Text className="text-sm text-gray-600 mt-1">
            {item.phoneNumbers[0].number}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide">
      <View className="flex-1 bg-white pt-12">
        <View className="flex-row items-center px-4 pb-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose} className="p-2">
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold ml-4">Select Contact</Text>
        </View>

        <View className="flex-row items-center mx-4 my-2 p-3 bg-gray-100 rounded-lg">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 text-base ml-3 mb-1"
            placeholder="Search contacts..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {loading ? (
          <ActivityIndicator className="flex-1 self-center" size="large" />
        ) : (
          <StyledKeyboardAwareScrollView
            keyboardShouldPersistTaps="handled"
            className={'w-full'}
            enableOnAndroid>
            <FlatList
              keyboardShouldPersistTaps={'never'}
              data={filteredContacts}
              renderItem={renderContact}
              keyExtractor={(item: any) => item.id}
              className="flex-1"
            />
          </StyledKeyboardAwareScrollView>
        )}
      </View>
    </Modal>
  );
};
export default ContactListModal;
