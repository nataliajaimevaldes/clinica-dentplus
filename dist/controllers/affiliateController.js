"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AffiliateController = void 0;
const affiliate_schemas_js_1 = require("../schemas/affiliate.schemas.js");
const affiliate_model_js_1 = require("../models/affiliate.model.js");
const parseError_js_1 = require("../lib/parseError.js");
class AffiliateController {
    // MOSTRAR AFILIADOS
    static async index(req, res) {
        try {
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            const affiliates = await affiliate_model_js_1.AffiliateModel.getAll(userId);
            const userEmail = req.session?.userEmail;
            res.render("affiliates/index", {
                affiliates,
                userEmail
            });
        }
        catch (error) {
            console.log(error);
            res.send("Error al obtener afiliados");
        }
    }
    // VER FORMULARIO CREAR
    static async createView(req, res) {
        res.render("affiliates/create");
    }
    // CREAR AFILIADO
    static async create(req, res) {
        try {
            const validatedData = affiliate_schemas_js_1.affiliateSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = (0, parseError_js_1.formatZodErrors)(validatedData.error);
                return res.render("affiliates/create", {
                    errors
                });
            }
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            await affiliate_model_js_1.AffiliateModel.create(validatedData.data, userId);
            res.redirect("/affiliates");
        }
        catch (error) {
            console.log(error);
            res.render("affiliates/create", {
                errors: { general: "Error al crear afiliado" }
            });
        }
    }
    // VER DETALLE
    static async show(req, res) {
        try {
            const id = Number(req.params.id);
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            const affiliate = await affiliate_model_js_1.AffiliateModel.getById(id, userId);
            if (!affiliate || affiliate.userId !== userId) {
                return res.redirect("/affiliates");
            }
            res.render("affiliates/detail", {
                affiliate
            });
        }
        catch (error) {
            console.log(error);
            res.send("Error al obtener afiliado");
        }
    }
    // VER FORMULARIO EDITAR
    static async editView(req, res) {
        try {
            const id = Number(req.params.id);
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            const affiliate = await affiliate_model_js_1.AffiliateModel.getById(id, userId);
            if (!affiliate || affiliate.userId !== userId) {
                return res.redirect("/affiliates");
            }
            res.render("affiliates/edit", {
                affiliate
            });
        }
        catch (error) {
            console.log(error);
            res.send("Error al cargar edición");
        }
    }
    // ACTUALIZAR AFILIADO
    static async update(req, res) {
        try {
            const id = Number(req.params.id);
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            const validatedData = affiliate_schemas_js_1.affiliateSchema.safeParse(req.body);
            if (!validatedData.success) {
                const errors = (0, parseError_js_1.formatZodErrors)(validatedData.error);
                const affiliate = await affiliate_model_js_1.AffiliateModel.getById(id, userId);
                if (!affiliate) {
                    return res.redirect("/affiliates");
                }
                return res.render("affiliates/edit", {
                    affiliate,
                    errors,
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    membershipType: req.body.membershipType
                });
            }
            await affiliate_model_js_1.AffiliateModel.update(id, validatedData.data, userId);
            res.redirect("/affiliates");
        }
        catch (error) {
            console.log(error);
            res.render("affiliates/edit", {
                errors: { general: "Error al actualizar afiliado" }
            });
        }
    }
    // ELIMINAR AFILIADO
    static async delete(req, res) {
        try {
            const id = Number(req.params.id);
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            await affiliate_model_js_1.AffiliateModel.delete(id, userId);
            res.redirect("/affiliates");
        }
        catch (error) {
            console.log(error);
            res.send("Error al eliminar afiliado");
        }
    }
    // SIMULADOR DESCUENTO
    static async simulate(req, res) {
        try {
            const id = Number(req.params.id);
            const userId = req.session?.userId;
            if (!userId) {
                return res.redirect('/login');
            }
            const amount = Number(req.body.amount);
            const affiliate = await affiliate_model_js_1.AffiliateModel.getById(id, userId);
            if (!affiliate || affiliate.userId !== userId) {
                return res.redirect("/affiliates");
            }
            let discount = 0;
            if (affiliate.membershipType === "silver") {
                discount = 0.05;
            }
            if (affiliate.membershipType === "gold") {
                discount = 0.10;
            }
            if (affiliate.membershipType === "platinum") {
                discount = 0.20;
            }
            const finalPrice = amount - (amount * discount);
            res.render("affiliates/detail", {
                affiliate,
                simulation: {
                    amount,
                    finalPrice,
                    discountPercentage: discount * 100
                }
            });
        }
        catch (error) {
            console.log(error);
            res.send("Error simulando descuento");
        }
    }
}
exports.AffiliateController = AffiliateController;
