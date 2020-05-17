const { UserInputError, ApolloError, AuthenticationError } = require('apollo-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../Models/User.model')
const Post = require('../Models/Post.model')
const { loginValidator, registerValidator } = require('../utils/validators');
const checkAuth = require('../utils/checkAuth');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username
    },
    process.env.SECRET_KEY,
    { expiresIn: '1h' }
  );
}

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        return await Post.find();
      } catch (error) {
        throw new ApolloError('Posts could not be retrieved');
      }
    },
    getPost: async (_, args) => {
      try {
        let post = await Post.findById(args.id)
        if (!post) {
          throw new ApolloError('Could not find the post you are looking for');
        }
        return post;
      } catch (error) {
        throw new ApolloError('Could not find the post you are looking for', error);
      }
    }
  },

  Mutation: {
    ///////////////////// Register mutation /////////////////////
    register: async (_, { registerInput: { username, email, password, confirmPassword } }) => {
      // validate inputs
      const { errors, valid } = registerValidator({ username, email, password, confirmPassword });
      if (!valid) {
        throw new UserInputError('Validation Errors', { errors });
      }
      // verify user does not already have an account
      let user = await User.findOne({ username });
      if (user) {
        errors.username = 'Username is taken';
        throw new UserInputError('Username is taken', { errors })
      }
      user = await User.findOne({ email });
      if (user) {
        errors.email = 'This email has an account';
        throw new UserInputError('This email has an account', { errors })
      }
      // hash password
      let hashedPassword = await bcrypt.hash(password, 10);
      // save to db
      user = new User({
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      })
      const savedUser = await user.save();
      // generate token
      const token = generateToken(savedUser);

      // create User type response object
      return {
        ...savedUser._doc,
        id: savedUser._id,
        token
      };
    },
    ///////////////////// Login mutation /////////////////////
    login: async (_, { loginInput: { username, password } }) => {
      // validate inputs
      const { errors, valid } = loginValidator({ username, password });
      if (!valid) {
        throw new UserInputError('Validation Errors', { errors });
      }
      // check user exists
      let user = await User.findOne({ username });
      if (!user) {
        errors.general = 'User not found';
        throw new UserInputError('User does not have an account', { errors })
      }
      // validate password
      const verifyPassword = await bcrypt.compare(password, user.password)
      if (!verifyPassword) {
        errors.general = 'Wrong credentials';
        throw new UserInputError('Wrong credentials', { errors });
      }
      // generate token
      const token = generateToken(user);
      // create User type response object
      return {
        ...user._doc,
        id: user._id,
        token
      }
    },
    ///////////////////// Create Post /////////////////////
    createPost: async (_, { postInput: { body } }, context) => {
      // check authentication
      const user = checkAuth(context);
      // create post 
      let post = new Post({
        body: body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      // save post
      const newPost = await post.save();
      return newPost;
    },
    ///////////////////// Delete Post /////////////////////
    deletePost: async (_, args, context) => {
      // check authentication
      const user = checkAuth(context);
      try {
        // find post 
        let post = await Post.findById(args.postID);
        if (!post) throw new ApolloError('Post not found');
        // check if user id is equal to the user id of the post
        if (user.username !== post.username) throw new AuthenticationError('User is not authorized to delete this post');
        await post.remove();
        return { message: 'Post deleted' };
      } catch (error) {
        throw new ApolloError(error);
      }
    },
    ///////////////////// Create Comment /////////////////////
    createComment: async (_, { commentInput: { body, postID } }, context) => {
      // check authentication
      const user = checkAuth(context);
      // validate body input
      if (body.trim() === '') throw new UserInputError('Comment can not be submitted empty');
      // find post
      let post = await Post.findById(postID);
      if (!post) throw new ApolloError('Post could not be found');
      // add comment to post
      post.comments.unshift({
        body,
        username: user.username,
        createdAt: new Date().toISOString()
      })
      await post.save();
      return post
    },
    ///////////////////// Delete Comment /////////////////////
    deleteComment: async (_, { deleteCommentInput: { postID, commentID } }, context) => {
      // check authentication
      const user = checkAuth(context);
      // find post
      let post = await Post.findById(postID);
      if (!post) throw new ApolloError('Post could not be found');
      // check if user owns comment (username of commentID === username of user doing the action)
      const comment = post.comments.findIndex(comment => comment.id === commentID && comment.username === user.username);
      // remove item from array
      post.comments.splice(comment, 1);
      await post.save();
      return post
    },
    ///////////////////// Toggle Like Post /////////////////////
    likePost: async (_, { likeInput }, context) => {
      // check authentication
      const user = checkAuth(context);
      // find post
      let post = await Post.findById(likeInput.postID);
      if (!post) throw new ApolloError('Post could not be found');
      // condition: user liked post ? remove like : like post
      const findLike = post.likes.findIndex(like => like.username === user.username);
      if (findLike === -1) {
        post.likes.push({
          username: user.username,
          createdAt: new Date().toISOString()
        })
      } else {
        // unlike post
        post.likes.splice(findLike, 1);
      }
      await post.save();
      return post;
    }
  }
}

module.exports = resolvers


