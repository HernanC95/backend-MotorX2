const Car = require('../models/Cars')

 const controller = {
create: async(req, res) => {
    
    try {
        let new_car = await Car.create(req.body)
        res.status(201).json({
            id: new_car._id,
            success: true,
            message: 'The car has been created with success'
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
    },

    read: async(req, res) => {
        let query = {} 
        console.log(req.query)
        if (req.query.name) {
            query = {name:{"$regex": req.query.name, $options:'i'}}
        }
        if (req.query.price) {
            query = {
                ...query,
                price: req.query.price.split(',')
            }
        }
        try {
            let read_car = await Car.find(query)
            res.status(200).json({
                response: read_car,
                success: true,
                message: 'The cars has been found'
            })
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
        },

/* update: async(req, res) => {
    let { id } = req.params
    try {
        let oneCar = await Car.findOneAndUpdate({_id: id}, req.body, {new:true})
        if (oneCar){
            res.status(200).json({
            id: oneCar._id,
            success: true,
            message: 'The car has been modificated with success'
        })
        } else {
            res.status(404).json({
                success: false,
                message: "The car hasn't been found"
            })
        }       
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
    }, */
    destroy: async(req, res) => {
        let { id } = req.params
        try {
            let oneCar = await Car.findOneAndDelete({_id: id})
            if (oneCar){
                res.status(200).json({
                id: oneCar._id,
                success: true,
                message: 'The car has been deleted with success'
            })
            } else {
                res.status(404).json({
                    success: false,
                    message: "The car hasn't been found"
                })
            }
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            })
        }
        },
        readId: async(req, res) => {
            let { id } = req.params
            try {
                let oneCar = await Car.findById(id).populate([{path:'userId',select:'name photo -_id'}])
                if(id){
                    res.status(200).json({
                        response: oneCar,
                        success: true,
                        message: 'Car recovery succesfully'
                    })
                }else{
                    res.status(404).json({
                        succes: false,
                        message: 'No car found'
                    })
                }
            } catch (error) {
                res.status(400).json({
                    success: false,
                    message: error.message
                })
            }
            }
}


module.exports = controller