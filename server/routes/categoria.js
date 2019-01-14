const express = require('express');

let = { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion')

let app = express();

let Categoria = require('../models/categoria')

//=============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Categoria.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    registros: conteo
                });
            })


        })



})


//=============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(....);
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

});


//=============================
// Crear una categoria
//=============================
app.post('/categoria', [verificaToken, verificaAdminRole], (req, res) => {
    //regresa la nueva categoria
    //req.usuario.id

    let body = req.body;


    let categoria = new Categoria({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });




})

//=============================
// Actualizar una categoria
//=============================
app.put('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {

    let id = req.params.id;

    let nombreCategoria = {
        nombre: req.body.nombre
    }

    Categoria.findByIdAndUpdate(id, nombreCategoria, { new: true }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }




        res.json({
            ok: true,
            categoria: categoriaDB
        })

    })

})

//=============================
// Borrar una categoria
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    // Solo un administrador puede borrar categorias
    // eliminar fisicamente
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }



        res.json({
            ok: true,
            categoria_elminada: categoriaDB
        })



    })

})







module.exports = app;