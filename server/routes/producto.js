const express = require('express');

const { verificaToken } = require('../middlewares/autenticacion')

let app = express();

let Producto = require('../models/producto');

//Obtener productos
app.get('/producto', verificaToken, (req, res) => {
    //Trae todo los productos
    // populate: usuario y categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .skip(desde)
        .limit(limite)
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Producto.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    registros: conteo
                });
            })


        })

});

//Obtener producto por id
app.get('/producto/:id', verificaToken, (req, res) => {
    // populate: usuario y categoria

    let id = req.params.id;

    Producto.find({ _id: id })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, producto) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto
            });



        })


});

//Buscar productos
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })


})

//Crear un producto
app.post('/producto', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado

    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precio,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            producto: productoDB
        });

    });





});

//Actualizar un producto
app.put('/producto/:id', verificaToken, (req, res) => {
    //Grabar el usuario
    //Grabar una categoria del listado
    let id = req.params.id

    let productoActualizado = {
        nombre: req.body.nombre,
        categoria: req.body.categoria,
        descripcion: req.body.descripcion,
        usuario: req.body.usuario
    }

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true }, (err, productoDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            producto: productoDB
        })

    })


});

//Borrar un producto
app.delete('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id


    Producto.findByIdAndUpdate(id, { disponible: false }, { new: true }, (err, productoBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            producto: productoBorrado
        })

    })

});

module.exports = app;