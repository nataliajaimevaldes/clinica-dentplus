import type { Request, Response } from 'express'
import { affiliateSchema } from '../schemas/affiliate.schemas.js';
import { AffiliateModel } from '../models/affiliate.model.js';
import { parseError } from '../lib/parseError.js';
import { formatZodErrors } from '../lib/parseError.js';

export class AffiliateController {

  // MOSTRAR AFILIADOS
  static async index(req: Request, res: Response) {
    try {
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      const affiliates = await AffiliateModel.getAll(userId);
      const userEmail = req.session?.userEmail;
      res.render("affiliates/index", {
        affiliates,
        userEmail
      });
    } catch (error) {
      console.log(error);
      res.send("Error al obtener afiliados");
    }
  }

  // VER FORMULARIO CREAR
  static async createView(req: Request, res: Response) {
    res.render("affiliates/create");
  }

  // CREAR AFILIADO
  static async create(req: Request, res: Response) {
    try {
      const validatedData = affiliateSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errors = formatZodErrors(validatedData.error);
        return res.render("affiliates/create", {
          errors
        });
      }

      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      await AffiliateModel.create(validatedData.data, userId);
      res.redirect("/affiliates");

    } catch (error) {
      console.log(error);
      res.render("affiliates/create", {
        errors: { general: "Error al crear afiliado" }
      });
    }
  }

  // VER DETALLE
  static async show(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      const affiliate = await AffiliateModel.getById(id, userId);

      if (!affiliate || affiliate.userId !== userId) {
        return res.redirect("/affiliates");
      }

      res.render("affiliates/detail", {
        affiliate
      });

    } catch (error) {
      console.log(error);
      res.send("Error al obtener afiliado");
    }
  }

  // VER FORMULARIO EDITAR
  static async editView(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      const affiliate = await AffiliateModel.getById(id, userId);

      if (!affiliate || affiliate.userId !== userId) {
        return res.redirect("/affiliates");
      }

      res.render("affiliates/edit", {
        affiliate
      });

    } catch (error) {
      console.log(error);
      res.send("Error al cargar edición");
    }
  }

  // ACTUALIZAR AFILIADO
  static async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }

      const validatedData = affiliateSchema.safeParse(req.body);

      if (!validatedData.success) {
        const errors = formatZodErrors(validatedData.error);
        const affiliate = await AffiliateModel.getById(id, userId);
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

      await AffiliateModel.update(id, validatedData.data, userId);
      res.redirect("/affiliates");

    } catch (error) {
      console.log(error);
      res.render("affiliates/edit", {
        errors: { general: "Error al actualizar afiliado" }
      });
    }
  }

  // ELIMINAR AFILIADO
  static async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      await AffiliateModel.delete(id, userId);
      res.redirect("/affiliates");

    } catch (error) {
      console.log(error);
      res.send("Error al eliminar afiliado");
    }
  }

  // SIMULADOR DESCUENTO
  static async simulate(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const userId = req.session?.userId
      if (!userId) {
        return res.redirect('/login')
      }
      const amount = Number(req.body.amount);

      const affiliate = await AffiliateModel.getById(id, userId);

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

    } catch (error) {
      console.log(error);
      res.send("Error simulando descuento");
    }
  }
}