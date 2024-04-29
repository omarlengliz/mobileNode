const Genre = require("../models/Genre");

const fetchAll = async (req,res) =>{
    try {
        const genres = await Genre.find();

        res.status(200).json({ status: "success", data: genres });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch genres" , error: error.message });
    }
} 

module.exports = {
    fetchAll
}