const Card = require('../models/card');
const NotFoundError = require('../utils/errors/notFound-error');
const ForbiddenError = require('../utils/errors/forbidden-error');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => next(err));
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Карточки с указанным _id не cуществует');
    })
    .then((card) => {
      if (`${card.owner}` !== req.user._id) {
        throw new ForbiddenError('Удалять можно только свою карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .orFail(() => {
          throw new NotFoundError('Карточка с указанным _id не найдена');
        })
        .then(() => {
          res.send({ message: 'успешно' });
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с указанным _id не найдена');
    })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Карточки с указанным _id не найдена');
    })
    .then((newData) => {
      res.send(newData);
    })
    .catch((err) => next(err));
};
