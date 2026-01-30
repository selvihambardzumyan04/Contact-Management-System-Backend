import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { contacts, getContactsByUserId, findContactById } from '../data/store.js';
import { authenticate } from '../middleware/auth.js';
import { AppError } from '../middleware/errorHandler.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all contacts for the authenticated user
router.get('/', (req, res, next) => {
  try {
    const userContacts = getContactsByUserId(req.user.userId);
    res.json({
      count: userContacts.length,
      contacts: userContacts
    });
  } catch (error) {
    next(error);
  }
});

// Get a single contact by ID
router.get('/:id', (req, res, next) => {
  try {
    const contact = findContactById(req.params.id);

    if (!contact) {
      throw new AppError('Contact not found.', 404);
    }

    // Ensure user owns this contact
    if (contact.userId !== req.user.userId) {
      throw new AppError('Access denied.', 403);
    }

    res.json(contact);
  } catch (error) {
    next(error);
  }
});

// Create a new contact
router.post('/', (req, res, next) => {
  try {
    const { firstName, lastName, email, phone, company, notes } = req.body;

    // Validation
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required.', 400);
    }

    const contactId = uuidv4();
    const contact = {
      userId: req.user.userId,
      firstName,
      lastName,
      email: email || '',
      phone: phone || '',
      company: company || '',
      notes: notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    contacts.set(contactId, contact);

    res.status(201).json({
      message: 'Contact created successfully',
      contact: { id: contactId, ...contact }
    });
  } catch (error) {
    next(error);
  }
});

// Update a contact
router.put('/:id', (req, res, next) => {
  try {
    const contact = findContactById(req.params.id);

    if (!contact) {
      throw new AppError('Contact not found.', 404);
    }

    // Ensure user owns this contact
    if (contact.userId !== req.user.userId) {
      throw new AppError('Access denied.', 403);
    }

    const { firstName, lastName, email, phone, company, notes } = req.body;

    // Validation
    if (!firstName || !lastName) {
      throw new AppError('First name and last name are required.', 400);
    }

    const updatedContact = {
      userId: contact.userId,
      firstName,
      lastName,
      email: email || '',
      phone: phone || '',
      company: company || '',
      notes: notes || '',
      createdAt: contact.createdAt,
      updatedAt: new Date().toISOString()
    };

    contacts.set(req.params.id, updatedContact);

    res.json({
      message: 'Contact updated successfully',
      contact: { id: req.params.id, ...updatedContact }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a contact
router.delete('/:id', (req, res, next) => {
  try {
    const contact = findContactById(req.params.id);

    if (!contact) {
      throw new AppError('Contact not found.', 404);
    }

    // Ensure user owns this contact
    if (contact.userId !== req.user.userId) {
      throw new AppError('Access denied.', 403);
    }

    contacts.delete(req.params.id);

    res.json({
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

