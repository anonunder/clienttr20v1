# Chat System Documentation

Real-time chat system using Socket.IO for client-trainer and group communication.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Connection Setup](#connection-setup)
- [Role-Based Access](#role-based-access)
- [Direct Messaging](#direct-messaging)
  - [Client → Trainer](#client--trainer-communication)
  - [Trainer → Client](#trainer--client-communication)
- [Group Chat](#group-chat)
- [Socket Events Reference](#socket-events-reference)
- [Message Types](#message-types)
- [Room Management](#room-management)
- [Admin Features](#admin-features)
- [Code Examples](#code-examples)

---

## Overview

The chat system provides:

- **Direct messaging** between clients and trainers
- **Group chat** for team communication
- **Real-time typing indicators**
- **Read receipts**
- **Online status tracking**
- **Message search**
- **Role-based permissions**

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Socket.IO Server                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┐ │
│  │  Client Routes  │  │ Trainer Routes  │  │Shared Routes│ │
│  │  (client:*)     │  │  (trainer:*)    │  │  (user:*)   │ │
│  └────────┬────────┘  └────────┬────────┘  └──────┬──────┘ │
│           │                    │                   │        │
│           └──────────┬─────────┴───────────────────┘        │
│                      │                                      │
│              ┌───────▼───────┐                              │
│              │Chat Controller│                              │
│              └───────┬───────┘                              │
│                      │                                      │
│              ┌───────▼───────┐                              │
│              │ Chat Service  │                              │
│              └───────────────┘                              │
└─────────────────────────────────────────────────────────────┘
```

## Connection Setup

### 1. Establish Socket Connection

```javascript
import { io } from 'socket.io-client';

const socket = io(SOCKET_URL, {
  auth: {
    token: 'your-jwt-token'
  },
  transports: ['websocket', 'polling']
});

socket.on('connect', () => {
  console.log('Connected to chat server');
});

socket.on('disconnect', () => {
  console.log('Disconnected from chat server');
});

socket.on('connect_error', (error) => {
  console.error('Connection error:', error.message);
});
```

### 2. Authentication Flow

The socket middleware authenticates users using JWT tokens:

1. Token is validated on connection
2. User data is attached to `socket.user`
3. Company context is attached to `socket.companyId`
4. User automatically joins their personal room: `user:{userId}`
5. User automatically joins company room: `company:{companyId}`
6. User automatically joins their group rooms: `group:{groupId}`

---

## Role-Based Access

### User Roles

| Role      | Level         | Can Message          |
|-----------|---------------|----------------------|
| `admin`   | Trainer-level | Everyone             |
| `manager` | Trainer-level | Everyone             |
| `trainer` | Trainer-level | Clients only         |
| `client`  | Client-level  | Trainers/Managers/Admins |

### Event Prefixes by Role

| Role Type     | Event Prefix              |
|---------------|---------------------------|
| Clients       | `company:chat:client:*`   |
| Trainers      | `company:chat:trainer:*`  |
| Shared        | `company:chat:user:*`     |
| Groups        | `company:chat:group:*`    |
| Management    | `company:chat:manage:*`   |
| Admin         | `company:chat:admin:*`    |

---

## Direct Messaging

### Client → Trainer Communication

Clients use `company:chat:client:*` events to communicate with trainers.

#### Get Available Trainers

```javascript
socket.emit('company:chat:client:getTrainers', {
  search: '',      // Optional: search by name
  limit: 20,       // Optional: pagination limit
  offset: 0        // Optional: pagination offset
}, (response) => {
  if (response.success) {
    console.log('Trainers:', response.trainers);
    console.log('Total:', response.total);
  }
});
```

**Response:**
```javascript
{
  success: true,
  trainers: [
    {
      id: 'uuid',
      name: 'John Trainer',
      email: 'john@example.com',
      avatar: 'url',
      role: 'trainer',
      is_online: true,
      last_message: { ... },
      unread_count: 2
    }
  ],
  total: 5,
  limit: 20,
  offset: 0
}
```

#### Send Message to Trainer

```javascript
socket.emit('company:chat:client:sendMessage', {
  recipient_id: 'trainer-uuid',
  type: 'text',                    // 'text', 'image', 'video', 'file'
  content: 'Hello trainer!',
  reply_to: null,                  // Optional: message ID to reply to
  metadata: {}                     // Optional: additional data
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});
```

**Response:**
```javascript
{
  success: true,
  message: {
    id: 'message-uuid',
    sender_id: 'client-uuid',
    recipient_id: 'trainer-uuid',
    type: 'text',
    content: 'Hello trainer!',
    created_at: '2024-01-15T10:30:00Z',
    read_at: null
  }
}
```

#### Get Chat History with Trainer

```javascript
socket.emit('company:chat:client:getHistory', {
  trainer_id: 'trainer-uuid',
  limit: 50,                       // Optional: number of messages
  before_message_id: null,         // Optional: for pagination
  date_range: {                    // Optional: filter by date
    start: '2024-01-01',
    end: '2024-01-31'
  }
}, (response) => {
  if (response.success) {
    console.log('Messages:', response.messages);
    console.log('Has more:', response.has_more);
  }
});
```

#### Get Client's Chat List

```javascript
socket.emit('company:chat:client:getChatList', {
  limit: 20,
  offset: 0
}, (response) => {
  if (response.success) {
    console.log('Chats:', response.chats);
  }
});
```

#### Get Online Trainers

```javascript
socket.emit('company:chat:client:getOnlineTrainers', {}, (response) => {
  if (response.success) {
    console.log('Online trainers:', response.trainers);
    console.log('Count:', response.count);
  }
});
```

#### Mark Messages as Read

```javascript
socket.emit('company:chat:client:markRead', {
  trainer_id: 'trainer-uuid',
  message_ids: ['msg-1', 'msg-2']  // Optional: specific messages
}, (response) => {
  console.log('Marked as read:', response.success);
});
```

#### Send Typing Indicator

```javascript
socket.emit('company:chat:client:typing', {
  trainer_id: 'trainer-uuid',
  is_typing: true
}, (response) => {
  console.log('Typing indicator sent');
});
```

---

### Trainer → Client Communication

Trainers use `company:chat:trainer:*` events to communicate with clients.

#### Get Available Clients

```javascript
socket.emit('company:chat:trainer:getClients', {
  search: '',
  limit: 20,
  offset: 0
}, (response) => {
  if (response.success) {
    console.log('Clients:', response.clients);
  }
});
```

#### Send Message to Client

```javascript
socket.emit('company:chat:trainer:sendMessage', {
  recipient_id: 'client-uuid',
  type: 'text',
  content: 'Great progress today!',
  reply_to: null,
  metadata: {}
}, (response) => {
  if (response.success) {
    console.log('Message sent:', response.message);
  }
});
```

#### Get Chat History with Client

```javascript
socket.emit('company:chat:trainer:getHistory', {
  client_id: 'client-uuid',
  limit: 50,
  before_message_id: null
}, (response) => {
  if (response.success) {
    console.log('Messages:', response.messages);
  }
});
```

#### Get Trainer's Chat List

```javascript
socket.emit('company:chat:trainer:getChatList', {
  limit: 20,
  offset: 0
}, (response) => {
  if (response.success) {
    console.log('Chats:', response.chats);
  }
});
```

#### Get Online Clients

```javascript
socket.emit('company:chat:trainer:getOnlineClients', {}, (response) => {
  if (response.success) {
    console.log('Online clients:', response.clients);
  }
});
```

#### Mark Messages as Read

```javascript
socket.emit('company:chat:trainer:markRead', {
  client_id: 'client-uuid',
  message_ids: ['msg-1', 'msg-2']
}, (response) => {
  console.log('Marked as read:', response.success);
});
```

#### Send Typing Indicator

```javascript
socket.emit('company:chat:trainer:typing', {
  client_id: 'client-uuid',
  is_typing: true
});
```

#### Get All Users (Admin/Manager Only)

```javascript
socket.emit('company:chat:trainer:getAllUsers', {
  search: '',
  limit: 50,
  offset: 0
}, (response) => {
  if (response.success) {
    console.log('All users:', response.users);
  }
});
```

---

## Group Chat

Group chat is available to all users (clients and trainers).

### Get Group List

```javascript
socket.emit('company:chat:group:getList', {}, (response) => {
  if (response.success) {
    console.log('Groups:', response.groups);
  }
});
```

**Response:**
```javascript
{
  success: true,
  groups: [
    {
      id: 'group-uuid',
      name: 'Morning Workout Team',
      description: 'Daily 6AM workout group',
      avatar: 'url',
      member_count: 15,
      unread_count: 3,
      last_message: { ... },
      my_role: 'member'  // 'owner', 'admin', 'member'
    }
  ]
}
```

### Send Group Message

```javascript
socket.emit('company:chat:group:sendMessage', {
  group_id: 'group-uuid',
  type: 'text',
  content: 'Good morning team!',
  reply_to: null,
  metadata: {}
}, (response) => {
  if (response.success) {
    console.log('Group message sent:', response.message);
  }
});
```

### Get Group Chat History

```javascript
socket.emit('company:chat:group:getHistory', {
  group_id: 'group-uuid',
  limit: 50,
  before_message_id: null
}, (response) => {
  if (response.success) {
    console.log('Group messages:', response.messages);
  }
});
```

### Get Group Information

```javascript
socket.emit('company:chat:group:getInfo', {
  group_id: 'group-uuid'
}, (response) => {
  if (response.success) {
    console.log('Group info:', response.group);
  }
});
```

### Get Group Members

```javascript
socket.emit('company:chat:group:getMembers', {
  group_id: 'group-uuid'
}, (response) => {
  if (response.success) {
    console.log('Members:', response.members);
  }
});
```

### Group Typing Indicator

```javascript
socket.emit('company:chat:group:typing', {
  group_id: 'group-uuid',
  is_typing: true
});
```

---

## Group Management (Trainer-Level Only)

Only trainers, managers, and admins can manage groups.

### Create Group

```javascript
socket.emit('company:chat:manage:createGroup', {
  name: 'New Training Group',
  description: 'A group for advanced training',
  avatar: 'base64-or-url',         // Optional
  member_ids: ['user-1', 'user-2'] // Initial members
}, (response) => {
  if (response.success) {
    console.log('Group created:', response.group);
  }
});
```

### Edit Group

```javascript
socket.emit('company:chat:manage:editGroup', {
  group_id: 'group-uuid',
  name: 'Updated Name',
  description: 'Updated description',
  avatar: 'new-avatar-url'
}, (response) => {
  if (response.success) {
    console.log('Group updated:', response.group);
  }
});
```

### Delete Group

```javascript
socket.emit('company:chat:manage:deleteGroup', {
  group_id: 'group-uuid'
}, (response) => {
  if (response.success) {
    console.log('Group deleted');
  }
});
```

### Add Member to Group

```javascript
socket.emit('company:chat:manage:addMember', {
  group_id: 'group-uuid',
  user_id: 'user-uuid',
  role: 'member'  // 'admin' or 'member'
}, (response) => {
  if (response.success) {
    console.log('Member added');
  }
});
```

### Remove Member from Group

```javascript
socket.emit('company:chat:manage:removeMember', {
  group_id: 'group-uuid',
  user_id: 'user-uuid'
}, (response) => {
  if (response.success) {
    console.log('Member removed');
  }
});
```

### Update Member Role

```javascript
socket.emit('company:chat:manage:updateRole', {
  group_id: 'group-uuid',
  user_id: 'user-uuid',
  role: 'admin'  // 'admin' or 'member'
}, (response) => {
  if (response.success) {
    console.log('Role updated');
  }
});
```

---

## Socket Events Reference

### Incoming Events (Listen For)

| Event | Description | Payload |
|-------|-------------|---------|
| `company:chat:user:newMessage` | New direct message received | `{ message, sender }` |
| `company:chat:user:typing` | User typing indicator | `{ user_id, user_name, is_typing }` |
| `company:chat:user:messageRead` | Message marked as read | `{ message_ids, reader_id }` |
| `company:chat:group:newMessage` | New group message | `{ message, group_id, sender }` |
| `company:chat:group:typing` | Group typing indicator | `{ group_id, user_id, user_name, is_typing }` |
| `company:chat:group:memberAdded` | Member added to group | `{ group_id, user }` |
| `company:chat:group:memberRemoved` | Member removed from group | `{ group_id, user_id }` |
| `company:chat:user:online` | User came online | `{ user_id, user_name }` |
| `company:chat:user:offline` | User went offline | `{ user_id }` |

### Listening Example

```javascript
// Listen for new direct messages
socket.on('company:chat:user:newMessage', (data) => {
  console.log('New message from:', data.sender.name);
  console.log('Message:', data.message.content);
  // Update UI, show notification, etc.
});

// Listen for typing indicators
socket.on('company:chat:user:typing', (data) => {
  if (data.is_typing) {
    console.log(`${data.user_name} is typing...`);
  }
});

// Listen for new group messages
socket.on('company:chat:group:newMessage', (data) => {
  console.log(`[${data.group_id}] ${data.sender.name}: ${data.message.content}`);
});

// Listen for online status changes
socket.on('company:chat:user:online', (data) => {
  console.log(`${data.user_name} is now online`);
});

socket.on('company:chat:user:offline', (data) => {
  console.log(`User ${data.user_id} went offline`);
});
```

---

## Message Types

| Type | Description | Metadata |
|------|-------------|----------|
| `text` | Plain text message | None |
| `image` | Image attachment | `{ url, width, height, size }` |
| `video` | Video attachment | `{ url, duration, thumbnail, size }` |
| `file` | File attachment | `{ url, filename, mimetype, size }` |
| `system` | System notification | `{ action, details }` |

### Sending Media Messages

```javascript
// Send image
socket.emit('company:chat:client:sendMessage', {
  recipient_id: 'trainer-uuid',
  type: 'image',
  content: 'Check my progress!',
  metadata: {
    url: 'https://storage.example.com/image.jpg',
    width: 1920,
    height: 1080,
    size: 524288
  }
}, callback);

// Send file
socket.emit('company:chat:client:sendMessage', {
  recipient_id: 'trainer-uuid',
  type: 'file',
  content: 'My workout plan',
  metadata: {
    url: 'https://storage.example.com/plan.pdf',
    filename: 'workout-plan.pdf',
    mimetype: 'application/pdf',
    size: 102400
  }
}, callback);
```

---

## Room Management

### Manual Room Operations

```javascript
// Join a specific room
socket.emit('join:room', { room: 'group:uuid' }, (response) => {
  console.log('Joined room:', response.room);
  console.log('All rooms:', response.allRooms);
});

// Leave a room
socket.emit('leave:room', { room: 'group:uuid' }, (response) => {
  console.log('Left room:', response.success);
});

// Test room membership
socket.emit('test:room:membership', { groupId: 'group-uuid' }, (response) => {
  console.log('In group room:', response.isInGroupRoom);
  console.log('All rooms:', response.rooms);
});

// Sync group membership (rejoin all groups)
socket.emit('sync:group:membership', (response) => {
  console.log('Left rooms:', response.leftRooms);
  console.log('Joined rooms:', response.joinedRooms);
});
```

---

## Search

### Search Messages

```javascript
socket.emit('company:chat:search:messages', {
  query: 'workout',
  chat_type: 'user',     // 'user' or 'group'
  chat_id: 'user-uuid',  // User ID or Group ID
  limit: 20,
  offset: 0
}, (response) => {
  if (response.success) {
    console.log('Search results:', response.messages);
  }
});
```

---

## Admin Features

Admin-only features for chat management.

### Get Chat Statistics

```javascript
socket.emit('company:chat:admin:getStats', {}, (response) => {
  if (response.success) {
    console.log('Stats:', response.stats);
    // { total_messages, active_users, groups_count, ... }
  }
});
```

### Message Retention Settings

```javascript
// Get retention settings
socket.emit('company:chat:admin:getRetentionSettings', {}, (response) => {
  console.log('Retention settings:', response.settings);
});

// Update retention settings
socket.emit('company:chat:admin:updateRetentionSettings', {
  text: '365d',
  image: '180d',
  video: '90d',
  file: '180d',
  system: '90d'
}, (response) => {
  console.log('Settings updated:', response.success);
});

// Run manual cleanup
socket.emit('company:chat:admin:runCleanup', {}, (response) => {
  console.log('Cleanup result:', response.result);
});

// Get cleanup status
socket.emit('company:chat:admin:getCleanupStatus', {}, (response) => {
  console.log('Cleanup status:', response.status);
});
```

---

## Code Examples

### Complete Client Chat Implementation

```javascript
// chatService.js - Client Side

import { io } from 'socket.io-client';

class ChatService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
  }

  // Initialize connection
  connect(token) {
    this.socket = io(process.env.EXPO_PUBLIC_SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    });

    this.setupListeners();
    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => resolve(this.socket));
      this.socket.on('connect_error', reject);
    });
  }

  // Setup event listeners
  setupListeners() {
    this.socket.on('company:chat:user:newMessage', (data) => {
      this.emit('newMessage', data);
    });

    this.socket.on('company:chat:user:typing', (data) => {
      this.emit('typing', data);
    });

    this.socket.on('company:chat:group:newMessage', (data) => {
      this.emit('groupMessage', data);
    });
  }

  // Event emitter pattern
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(callback);
  }

  emit(event, data) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  // CLIENT METHODS

  async getTrainers(options = {}) {
    return this.emitAsync('company:chat:client:getTrainers', options);
  }

  async sendMessageToTrainer(trainerId, content, type = 'text', metadata = {}) {
    return this.emitAsync('company:chat:client:sendMessage', {
      recipient_id: trainerId,
      type,
      content,
      metadata
    });
  }

  async getTrainerHistory(trainerId, options = {}) {
    return this.emitAsync('company:chat:client:getHistory', {
      trainer_id: trainerId,
      ...options
    });
  }

  async getChatList(options = {}) {
    return this.emitAsync('company:chat:client:getChatList', options);
  }

  async markAsRead(trainerId, messageIds = []) {
    return this.emitAsync('company:chat:client:markRead', {
      trainer_id: trainerId,
      message_ids: messageIds
    });
  }

  sendTyping(trainerId, isTyping) {
    this.socket.emit('company:chat:client:typing', {
      trainer_id: trainerId,
      is_typing: isTyping
    });
  }

  // GROUP METHODS

  async getGroups() {
    return this.emitAsync('company:chat:group:getList', {});
  }

  async sendGroupMessage(groupId, content, type = 'text', metadata = {}) {
    return this.emitAsync('company:chat:group:sendMessage', {
      group_id: groupId,
      type,
      content,
      metadata
    });
  }

  async getGroupHistory(groupId, options = {}) {
    return this.emitAsync('company:chat:group:getHistory', {
      group_id: groupId,
      ...options
    });
  }

  // UTILITY

  emitAsync(event, data) {
    return new Promise((resolve, reject) => {
      this.socket.emit(event, data, (response) => {
        if (response.success) {
          resolve(response);
        } else {
          reject(new Error(response.error || response.message));
        }
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export default new ChatService();
```

### React Native Hook Example

```javascript
// useChat.js

import { useState, useEffect, useCallback } from 'react';
import chatService from '../services/chatService';

export const useChat = (token) => {
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        await chatService.connect(token);
        setConnected(true);
        
        // Load chat list
        const response = await chatService.getChatList();
        setChats(response.chats);
      } catch (error) {
        console.error('Chat connection error:', error);
      }
    };

    init();

    // Listen for new messages
    chatService.on('newMessage', (data) => {
      setMessages(prev => [...prev, data.message]);
    });

    return () => {
      chatService.disconnect();
    };
  }, [token]);

  const sendMessage = useCallback(async (recipientId, content) => {
    const response = await chatService.sendMessageToTrainer(recipientId, content);
    setMessages(prev => [...prev, response.message]);
    return response;
  }, []);

  const loadHistory = useCallback(async (trainerId) => {
    const response = await chatService.getTrainerHistory(trainerId);
    setMessages(response.messages);
    return response;
  }, []);

  return {
    connected,
    messages,
    chats,
    sendMessage,
    loadHistory,
    markAsRead: chatService.markAsRead.bind(chatService),
    sendTyping: chatService.sendTyping.bind(chatService)
  };
};
```

### Redux Integration Example

```javascript
// features/chat/chatSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import chatService from '../../services/chatService';

export const fetchChatList = createAsyncThunk(
  'chat/fetchChatList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatService.getChatList();
      return response.chats;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ recipientId, content, type = 'text' }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendMessageToTrainer(recipientId, content, type);
      return response.message;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    chats: [],
    messages: {},      // { chatId: [messages] }
    activeChat: null,
    loading: false,
    error: null
  },
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(message);
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatList.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchChatList.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChatList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const message = action.payload;
        const chatId = message.recipient_id;
        if (!state.messages[chatId]) {
          state.messages[chatId] = [];
        }
        state.messages[chatId].push(message);
      });
  }
});

export const { setActiveChat, addMessage, clearError } = chatSlice.actions;
export default chatSlice.reducer;
```

---

## Error Handling

All socket events use callbacks with a standard response format:

```javascript
// Success response
{
  success: true,
  // ... data fields
}

// Error response
{
  success: false,
  error: 'Error message description',
  message: 'Alternative error message'
}
```

### Common Error Codes

| Error | Description |
|-------|-------------|
| `This endpoint is only available for clients` | Client tried to use trainer endpoint |
| `This endpoint is only available for trainers, managers, and admins` | Trainer endpoint access denied |
| `Only trainers, managers, and admins can create groups` | Group management permission denied |
| `Trainer ID is required` | Missing required parameter |
| `Client ID is required` | Missing required parameter |
| `Group not found` | Invalid group ID |
| `You are not a member of this group` | Group access denied |

---

## Best Practices

1. **Always handle callbacks** - Every emit should have a callback for error handling
2. **Implement reconnection logic** - Handle disconnects gracefully
3. **Debounce typing indicators** - Don't spam typing events
4. **Paginate message history** - Load messages in batches
5. **Cache messages locally** - Reduce server requests
6. **Mark messages as read** - Keep read status accurate
7. **Use optimistic updates** - Show messages immediately, handle failures

---

## Related Documentation

- [Authentication](../02-authentication/README.md)
- [Socket Connection](../01-architecture/sockets.md)
- [API Reference](../05-api-reference/README.md)

