const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3019;

// MongoDB connection string
const mongoURI = 'mongodb+srv://akshayamurugesan2094:3y3VN75C1ojtCyjc@cluster0.hfyww.mongodb.net/RecipeBook?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.error('Could not connect to MongoDB:', error));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Recipe Schema
const recipeSchema = new mongoose.Schema({
    recipe_number: { type: String, required: true },
    recipe_name: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Model for the recipes collection
const Recipe = mongoose.model('recipe', recipeSchema); // 'recipe' as the collection name

// Routes

// 1. Create a new recipe
app.post('/api/recipe', async (req, res) => {
    try {
        const { recipe_number, recipe_name } = req.body;
        console.log(`Received recipe: ${recipe_number}, ${recipe_name}`); // Log received data

        const newRecipe = new Recipe({ recipe_number, recipe_name });
        await newRecipe.save();
        console.log(`Saved recipe: ${newRecipe}`); // Log saved recipe
        res.status(201).json(newRecipe);
    } catch (error) {
        console.error('Error saving recipe:', error); // Log error
        res.status(400).json({ message: error.message });
    }
});

// 2. Get all recipes
app.get('/api/recipe', async (req, res) => {
    try {
        const recipes = await Recipe.find();
        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. Update a recipe by ID
app.put('/api/recipe/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(recipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 4. Delete a recipe by ID
app.delete('/api/recipe/:id', async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json({ message: 'Recipe deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
