const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/auth");
const Contact = require("../models/Contact");

// route post api/contacts
// desc  get all user contact
// acesss private
router.get("/", auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (err) {
    console.log(err.message);
    res.send(500).send("server error");
  }
});
// route post api/contacts/:id
// desc  get all user contact
// acesss private
router.post(
  "/",
  [auth, [check("name", "ener a name").not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, email, phone, type } = req.body;
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        user: req.user.id,
      });
      const contact = await newContact.save();
      res.json(contact);
    } catch (err) {
      console.log(err.message);
      res.status(400).send("server error");
    }
  }
);

router.put("/:id", auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  // buld contact object
  const contactField = {};
  if (name) contactField.name = name;
  if (email) contactField.email = email;
  if (phone) contactField.phone = phone;
  if (type) contactField.type = type;
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: "concatct not found" });

    // make sure user owns ocntacts

    if (contact.user.toString() != req.user.id) {
      return res.status(401).json({ msg: "not authorised" });
    }
    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: contactField },
      { new: true }
    );
    res.json(contact);
  } catch (err) {
    console.log(err.message);
    res.status(500).send("server error");
  }
});

router.put("/:id", (req, res) => {
  res.send("delete contact");
});

module.exports = router;
