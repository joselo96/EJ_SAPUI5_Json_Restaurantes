sap.ui.define([
    "sap/ui/core/mvc/Controller"
  ], (BaseController) => {
    "use strict";
  
    return BaseController.extend("inetum.restaurantes.controller.Details", {
        onInit() {
          console.log("Inicio de pagina Detalles")
          let oModel = this.getOwnerComponent().getModel("mModeloDatos");
          let aRestaurant = oModel.getProperty("/detallesRestaurante");
          console.log(aRestaurant)
                    
        }
    });
  });