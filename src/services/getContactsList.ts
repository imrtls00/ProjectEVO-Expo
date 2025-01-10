import * as Contacts from 'expo-contacts';

interface ContactInfo {
  id: string;
  name: string;
  phoneNumbers?: Array<{
    number: string;
    label: string;
  }>;
  emails?: Array<{
    email: string;
    label: string;
  }>;
}

export const getContactsList = async (): Promise<ContactInfo[]> => {
  try {
    // Request permissions
    const { status } = await Contacts.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access contacts was denied');
    }

    // Fetch contacts
    const { data } = await Contacts.getContactsAsync({
      fields: [
        Contacts.Fields.ID,
        Contacts.Fields.Name,
        Contacts.Fields.PhoneNumbers,
        Contacts.Fields.Emails,
      ],
    });

    if (data.length === 0) {
      return [];
    }

    // Format contacts data
    return data.map((contact) => ({
      id: contact.id,
      name: contact.name || 'Unknown',
      phoneNumbers: contact.phoneNumbers?.map(phone => ({
        number: phone.number,
        label: phone.label || 'other'
      })),
      emails: contact.emails?.map(email => ({
        email: email.email,
        label: email.label || 'other'
      }))
    }));

  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
};

// Usage example:
/*
try {
  const contacts = await getContactsList();
  console.log(contacts);
} catch (error) {
  console.error(error);
}
*/