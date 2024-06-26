const addCartItem = (Cart) => (req, res, next) => {
    Cart.findOne({ creator: req.userData.userId, item: req.body.itemId })
        .populate("item")
        .select("item")
        .then((data) => {
            if (data) {
                req.method = "PUT";
                req.body.itemId = data.item._id;
                req.body.quantity = data.quantity;
                req.params.id = data._id;

                editCartItem(req, res, next);
            } else {
                const cart = new Cart({
                    item: req.body.itemId,
                    quantity: 1,
                    creator: req.userData.userId,
                });
                cart.save()
                    .then((result) => {
                        res.status(201).json({
                            message: "success",
                            id: result._id,
                        });
                    })
                    .catch((error) => {
                        res.status(500).json({
                            message: "Creating Cart Item Failed!",
                            error: error,
                        });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({
                message: "Creating Cart Item Failed!",
                error: error,
            });
        });
};

const editCartItem = (Cart) => (req, res, next) => {
    if (req.body.quantity <= 0) {
        deleteCartItem(req, res, next);
    } else {
        const cartItem = new Cart({
            _id: req.params.id,
            item: req.body.itemId,
            quantity: req.body.quantity,
            creator: req.userData.userId,
        });
        Cart.updateOne(
            { _id: req.params.id, creator: req.userData.userId },
            cartItem
        )
            .then((result) => {
                if (result.modifiedCount > 0 || result.matchedCount > 0) {
                    res.status(200).json({
                        message: "success",
                    });
                } else {
                    res.status(401).json({
                        message:
                            "You are not Authorized to perform the action!",
                    });
                }
            })
            .catch((err) => {
                res.status(500).json({
                    message: "Updating CartItem Failed!",
                    error: err,
                });
            });
    }
};

const getCart = (Cart) => (req, res, next) => {
    Cart.find({ creator: req.userData.userId })
        .populate("item")
        .then((items) => {
            if (items) {
                res.status(200).json({
                    message: "success",
                    cartItems: items,
                });
            } else {
                res.status(404).json({
                    message: "failed",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Fetching the cart items failed!",
                error: err,
            });
        });
};

const deleteCart = (Cart) => (req, res, next) => {
    Cart.deleteMany({ creator: req.userData.userId })
        .then((result) => {
            console.log(result);
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: "success",
                });
            } else {
                res.status(401).json({
                    message: "You are not Authorized to perform the action!",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Couldn't delete Cart!",
                error: err,
            });
        });
};

const deleteCartItem = (Cart) => (req, res, next) => {
    Cart.deleteOne({ _id: req.params.id, creator: req.userData.userId })
        .then((result) => {
            console.log(result);
            if (result.deletedCount > 0) {
                res.status(200).json({
                    message: "success",
                });
            } else {
                res.status(401).json({
                    message: "You are not Authorized to perform the action!",
                });
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "Couldn't delete CartItem!",
                error: err,
            });
        });
};

module.exports.cartController = {
    addCartItem,
    editCartItem,
    getCart,
    deleteCartItem,
    deleteCart,
};
