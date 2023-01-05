const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getUsers,
  getUser,
  updateAvatar,
  getCurrentUser,
} = require('../controllers/users');
const { updateProfile } = require('../controllers/users');
const { regExpUrl } = require('../utils/regexp/regExpUrl');

router.get('/me', getCurrentUser);
router.get('/', getUsers);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi.string().required().length(24).hex(),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
    }),
  }),
  updateProfile,
);

router.patch(
  '/me/avatar',
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().regex(regExpUrl),
    }),
  }),
  updateAvatar,
);

module.exports = router;
