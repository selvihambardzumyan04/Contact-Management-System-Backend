// In-memory data store (would be replaced with a database in production)

export const users = new Map();
export const contacts = new Map();

// Helper functions
export const findUserByEmail = (email) => {
  for (const [id, user] of users) {
    if (user.email === email) {
      return { id, ...user };
    }
  }
  return null;
};

export const findUserById = (id) => {
  const user = users.get(id);
  return user ? { id, ...user } : null;
};

export const getContactsByUserId = (userId) => {
  const userContacts = [];
  for (const [id, contact] of contacts) {
    if (contact.userId === userId) {
      userContacts.push({ id, ...contact });
    }
  }
  return userContacts;
};

export const findContactById = (contactId) => {
  const contact = contacts.get(contactId);
  return contact ? { id: contactId, ...contact } : null;
};

