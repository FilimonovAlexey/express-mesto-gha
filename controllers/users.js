const User = require('../models/user');
const {
  validationErrorCode,
  notFoundErrorCode,
  handleDefaultError,
} = require('../utils/errorConstans');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleDefaultError(err, res));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({
    name,
    about,
    avatar,
  })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({
          message: 'Переданы некорректные данные при создании пользователя.',
        });
        return;
      }
      handleDefaultError(err, res);
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res
          .status(notFoundErrorCode)
          .send({ message: 'Пользователя с указанным _id не существует' });
      } else if (err.name === 'CastError') {
        res.status(validationErrorCode).send({
          message: 'Переданы некорректные данные.',
        });
      } else {
        handleDefaultError(err, res);
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about, avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((updateData) => {
      res.send(updateData);
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(notFoundErrorCode).send({
          message: 'Пользователь по указанному _id не найден.',
        });
        return;
      }
      if (err.name === 'CastError') {
        res.status(validationErrorCode).send({
          message: 'Переданы некорректные данные при обновлении профиля.',
        });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(validationErrorCode).send({
          message: 'Имя пользователя должно быть длиной от 2 до 30 символов.',
        });
        return;
      }
      handleDefaultError(err, res);
    });
};

module.exports.updateAvatar = (req, res) => {
  const avatar = req.body;
  User.findByIdAndUpdate(req.user._id, avatar, {
    new: true,
    runValidators: true,
  })
    .orFail(() => {
      throw new Error('NotFoundError');
    })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => {
      if (err.message === 'NotFoundError') {
        res.status(notFoundErrorCode).send({
          message: 'Пользователь по указанному _id не найден.',
        });
        return;
      }
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(validationErrorCode).send({
          message: 'Переданы некорректные данные при обновлении аватара.',
        });
        return;
      }
      handleDefaultError(err, res);
    });
};
