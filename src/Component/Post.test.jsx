import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Post from './Post';

jest.mock('../services/databaseService', () => ({
  getPost: jest.fn(),
  getAllLikes: jest.fn(),
  getAllDislikes: jest.fn(),
  getAllComments: jest.fn(),
  postLike: jest.fn(),
  postDisLike: jest.fn(),
  postComments: jest.fn(),
  deletePost: jest.fn(),
}));

jest.mock('../services/storageService', () => ({
  filePreview: jest.fn(),
  previewPP: jest.fn(),
}));

jest.mock('../services/ServerSDK', () => ({
  postInteractions: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useParams: () => ({ postId: '123' }),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}));

describe('Post Component', () => {
  const mockStore = configureStore([]);
  const store = mockStore({
    auth: {
      userInfo: { $id: 'user1', fullName: 'Test User' },
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });
});
