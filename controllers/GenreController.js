const Genre = require("../models/Genre");

const fetchAll = async (req,res) =>{
    try {
        const genres = await Genre.find();

        res.status(200).json({ status: "success", data: genres });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch genres" , error: error.message });
    }
} 

const addGenre = async (req,res) =>{
    const {name} = req.body;
    try {
        const genre = await Genre.create({name});
        res.status(201).json({ status: "success", data: genre });
    } catch (error) {
        res.status(500).json({ message: "Failed to add genre" , error: error.message });
    }
}
const deleteGenre = async (req,res) =>{
    const {id} = req.params;
    try {
        const genre = await Genre.findByIdAndDelete(id);
        if (!genre) {
            return res.status(404).json({ message: "Genre not found" });
        }
        res.status(200).json({ status: "success", message: "Genre deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete genre" });
    }
}
module.exports = {
    fetchAll,
    addGenre , 
    deleteGenre
}