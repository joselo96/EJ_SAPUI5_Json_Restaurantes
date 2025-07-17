sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], (Controller, MessageToast, FilterOperator, Filter, Fragment, MessageBox) => {
    "use strict";

    return Controller.extend("inetum.restaurantes.controller.main", {
        onInit() {
        },
        onFilterName: function (oEvent) {

            let aFilters = [];
            let sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                let filter = new Filter("Nombre", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            let oTable = this.byId("IdRestaurante");
            let oBinding = oTable.getBinding("rows");
            oBinding.filter(aFilters, "Application");

        },
        onFilterUbication: function (oEvent) {

            let aFilters = [];
            let sQuery = oEvent.getSource().getValue();
            if (sQuery && sQuery.length > 0) {
                let filter = new Filter("Ubicación", FilterOperator.Contains, sQuery);
                aFilters.push(filter);
            }
            let oTable = this.byId("IdRestaurante");
            let oBinding = oTable.getBinding("rows");
            oBinding.filter(aFilters, "Application");
        },

        OnOpenFragment: function (oEvent) {
            if (!this.oAddDialog) {
                Fragment.load({
                    id: this.createId("IdAddRestaurant"),
                    name: "inetum.restaurantes.view.fragment.Add",
                    controller: this
                }).then(oDialog => {
                    this.oAddDialog = oDialog
                    this.getView().addDependent(oDialog)
                    this.oAddDialog.open()
                })
            }
            this.oAddDialog.open()



            let oInputNombre = this.byId("IdAddRestaurant--IdFgNombre")
            let oInputUbicacion = this.byId("IdAddRestaurant--IdFgUbicacion")
            let oinputRanking = this.byId("IdAddRestaurant--RatingInd")
            let oInputPlatos = this.byId("IdAddRestaurant--IdFgPlatos")
            let oInputPrecios = this.byId("IdAddRestaurant--IdComboBox")
            let oInputTelefono = this.byId("IdAddRestaurant--IdFgTelefono")
            let oInputSitioWeb = this.byId("IdAddRestaurant--IdFgSitioWeb")



            let aControls = [oInputNombre,
                oInputUbicacion,
                // oinputRanking,
                oInputPlatos,
                oInputPrecios,
                oInputTelefono,
                oInputSitioWeb]

            aControls.forEach((oControl) => {
                oControl.setValueState("None");
            });


            //----- Este funciona pero se debe usar promesa   -----------------
            /*
            if (!this._oDialog) {
                this._oDialog = await Fragment.load({
                  id: this.createId("IdProductsFragment"),
                  name: "inetum.restaurantes.view.fragment.Add",
                  controller: this
                  });
                this.getView().addDependent(this._oDialog);
              }
              this._oDialog.open();
              */
        },
        OnOpenFragmentUpdate: function (oEvent) {

            let oTable = this.byId("IdRestaurante")
            let oSelectedIndex = oTable.getSelectedIndex()

            if (oSelectedIndex === -1) {
                MessageToast.show("Por favor Seleccione una fila")
                return
            }

            let oRaw = oTable.getContextByIndex(oSelectedIndex).getProperty()
            let oContext = oTable.getContextByIndex(oSelectedIndex);
            // let sPath = oContext.getPath();

            let oModel = this.getOwnerComponent().getModel("mModeloDatos");
            oModel.setProperty("/nuevoRestaurante", {
                Nombre: oRaw.Nombre,
                Ubicación: oRaw.Ubicación,
                //Estrellas: oRaw[2].Estrellas,
                //Estrellas: oRaw.Estrellas,
                Cantidad_de_platos: oRaw.Cantidad_de_platos,
                Rango_de_precios: oRaw.Rango_de_precios,
                Teléfono: oRaw.Teléfono,
                Sitio_web: oRaw.Sitio_web
            });


            let oInputNombre = this.byId("IdUpdateRestaurant--_IDGenInp1ut")
            let oInputUbicacion = this.byId("IdUpdateRestaurant--_IDG1enInput1")
            //let oInputRanking = this.byId("IdUpdateRestaurant--Ratin1gInd")
            let oInputPlatos = this.byId("IdUpdateRestaurant--_IDG1enInput2")
            let oInputPrecios = this.byId("IdUpdateRestaurant--Combo1Box")
            let oInputTelefono = this.byId("IdUpdateRestaurant--_IDGenInp5ut21")
            let oInputSitioWeb = this.byId("IdUpdateRestaurant--_IDGenfI1nput1")

            let aControls = [oInputNombre,
                oInputUbicacion,
                //oinputRanking,
                oInputPlatos,
                oInputPrecios,
                oInputTelefono,
                oInputSitioWeb]



            if (!this.oUpdDialog) {
                Fragment.load({
                    id: this.createId("IdUpdateRestaurant"),
                    name: "inetum.restaurantes.view.fragment.Update",
                    controller: this
                }).then(oDialog => {
                    this.oUpdDialog = oDialog
                    this.getView().addDependent(oDialog)
                    this.oUpdDialog.open()
                })
            }

            this.oUpdDialog.open()

            aControls.forEach((oControl) => {
                oControl.setValueState("None");
            });





        },
        OnValidateDatos: function (aControls, oInputRanking) {

            let bValid = true // Booleano que dira si todos las validaciones son correctas 


            aControls.forEach((oControl) => {
                oControl.setValueState("None");
            });

            aControls.forEach((oControl) => {
                if (oControl.getValue() == "" || oControl.getValue() == null) {
                    oControl.setValueState("Error")
                    oControl.setValueStateText("El campo es obligatorio")
                    bValid = false;
                }
            })

            if (oInputRanking.getValue() == 0) {
                bValid = false;
                MessageBox.warning("Por favor indique Numero de Estrellas");
            }

            if (aControls[2].getValue() > 50) {

                aControls[2].setValueState("Error")
                aControls[2].setValueStateText("No se permiten mas de 50 platos")
                bValid = false;
            }

            if (!(aControls[3].getValue() == "Alto" || aControls[3].getValue() == "Medio" || aControls[3].getValue() == "Bajo")) {
                aControls[3].setValueState("Error")
                aControls[3].setValueStateText("Debe seleccionar una de las opciones")
                bValid = false;
            }

            if (aControls[4].getValue().length > 10 || aControls[4].getValue().length < 10) {
                aControls[4].setValueState("Error")
                aControls[4].setValueStateText("Ingrese un numero de telefono valido")
                bValid = false;
            }

            return bValid;

        },

        OnAddRestaurant: function () {

            let oInputNombre = this.byId("IdAddRestaurant--IdFgNombre")
            let oInputUbicacion = this.byId("IdAddRestaurant--IdFgUbicacion")
            let oinputRanking = this.byId("IdAddRestaurant--RatingInd")
            let oInputPlatos = this.byId("IdAddRestaurant--IdFgPlatos")
            let oInputPrecios = this.byId("IdAddRestaurant--IdComboBox")
            let oInputTelefono = this.byId("IdAddRestaurant--IdFgTelefono")
            let oInputSitioWeb = this.byId("IdAddRestaurant--IdFgSitioWeb")



            let aControls = [oInputNombre,
                oInputUbicacion,
                //oinputRanking,
                oInputPlatos,
                oInputPrecios,
                oInputTelefono,
                oInputSitioWeb]

            if (this.OnValidateDatos(aControls, oinputRanking, oInputPrecios,)) {

                let oModel = this.getOwnerComponent().getModel("mModeloDatos");
                let oNewRestaurant = oModel.getProperty("/nuevoRestaurante");
                let aRestaurant = oModel.getProperty("/Restaurantes");
                const oAdd = {
                    Nombre: oNewRestaurant.Nombre,
                    Ubicación: oNewRestaurant.Ubicación,
                    Estrellas: oNewRestaurant.Estrellas,
                    Cantidad_de_platos: oNewRestaurant.Cantidad_de_platos,
                    Tipo_de_comida: oNewRestaurant.Tipo_de_comida,
                    Rango_de_precios: oNewRestaurant.Rango_de_precios,
                    Teléfono: oNewRestaurant.Teléfono,
                    Sitio_web: oNewRestaurant.Sitio_web
                }

                aRestaurant.push(oAdd)
                MessageToast.show("Restaurante creado con exito")
                oModel.setProperty("/Restaurantes", aRestaurant)

                onCloseDialog();



            }

        },
        OnUpdateRestaurant: function (oEvent) {

            let oInputNombreUp = this.byId("IdUpdateRestaurant--_IDGenInp1ut")
            let oInputUbicacionUp = this.byId("IdUpdateRestaurant--_IDG1enInput1")
            let oInputRankingUp = this.byId("IdUpdateRestaurant--Ratin1gInd")
            let oInputPlatosUp = this.byId("IdUpdateRestaurant--_IDG1enInput2")
            let oInputPreciosUp = this.byId("IdUpdateRestaurant--Combo1Box")
            let oInputTelefonoUp = this.byId("IdUpdateRestaurant--_IDGenInp5ut21")
            let oInputSitioWebUp = this.byId("IdUpdateRestaurant--_IDGenfI1nput1")

            //let bValid = true // Booleano que dira si todos las validaciones son correctas 

            let aControlsUp = [oInputNombreUp,
                oInputUbicacionUp,
                //oInputRankingUp,
                oInputPlatosUp,
                oInputPreciosUp,
                oInputTelefonoUp,
                oInputSitioWebUp]


            if (this.OnValidateDatos(aControlsUp, oInputRankingUp)) {

                let oTable = this.byId("IdRestaurante")
                let oSelectedIndex = oTable.getSelectedIndex()

                let oModel = this.getOwnerComponent().getModel("mModeloDatos");
                let aRestaurant = oModel.getProperty("/Restaurantes");

                const aUpdate = {
                    Nombre: aControlsUp[0].getValue(),
                    Ubicación: aControlsUp[1].getValue(),
                    Estrellas: oInputRankingUp.getValue(),
                    Cantidad_de_platos: aControlsUp[2].getValue(),
                    Rango_de_precios: aControlsUp[3].getValue(),
                    Teléfono: aControlsUp[4].getValue(),
                    Sitio_web: aControlsUp[5].getValue()
                }
                aRestaurant[oSelectedIndex] = aUpdate;
                this.onCloseDialog()
                MessageToast.show("Restaurante modificado con exito")


            }

        },
        onCloseDialog: function () {

            let oModel = this.getOwnerComponent().getModel("mModeloDatos");

            oModel.setProperty("/nuevoRestaurante", {
                Nombre: "",
                Ubicación: "",
                Estrellas: 0,
                Cantidad_de_platos: null,
                Tipo_de_comida: "",
                Rango_de_precios: "",
                Teléfono: null,
                Sitio_web: ""
            })

            if (this.oUpdDialog) {
                this.oUpdDialog.close()
            }
            if (this.oAddDialog) {
                this.oAddDialog.close()
            }



        },
        OnDeleteRestaurant: function () {

            let oTable = this.byId("IdRestaurante")
            let oSelectedIndex = oTable.getSelectedIndex()

            if (oSelectedIndex === -1) {
                MessageToast.show("Por favor Seleccione un registro")
                return
            }
            MessageBox.confirm("¿Está seguro de que desea eliminar este restaurante?", {
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        let oTable = this.byId("IdRestaurante")
                        let oSelectedIndex = oTable.getSelectedIndex()
                        const oModel = this.getOwnerComponent().getModel("mModeloDatos")
                        const aRestaurantes = oModel.getProperty("/Restaurantes")
                        //const iIndex = parseInt(sPath.split("/").pop())

                        aRestaurantes.splice(oSelectedIndex, 1)
                        oModel.setProperty("/Restaurantes", aRestaurantes)
                        MessageToast.show("Restaurante eliminado con exito")
                    }
                }.bind(this)
            });


        },
      




    });
});