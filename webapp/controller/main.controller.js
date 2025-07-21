sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Filter",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "inetum/restaurantes/model/formatter"
], (Controller, MessageToast, FilterOperator, Filter, Fragment, MessageBox,formatter) => {
    "use strict";

    return Controller.extend("inetum.restaurantes.controller.main", {
        formatter:formatter,
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

        OnOpenFragment: function () {
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
            let oInputTipo = this.byId("IdAddRestaurant--IdFgTipo")
            let oInputUbicacion = this.byId("IdAddRestaurant--IdFgUbicacion")
            let oinputRanking = this.byId("IdAddRestaurant--RatingInd")
            let oInputPlatos = this.byId("IdAddRestaurant--IdFgPlatos")
            let oInputPrecios = this.byId("IdAddRestaurant--IdComboBox")
            let oInputTelefono = this.byId("IdAddRestaurant--IdFgTelefono")
            let oInputSitioWeb = this.byId("IdAddRestaurant--IdFgSitioWeb")



            let aControlsAdd = [oInputNombre,
                oInputTipo,
                oInputUbicacion,
                // oinputRanking,
                oInputPlatos,
                oInputPrecios,
                oInputTelefono,
                oInputSitioWeb]

            aControlsAdd.forEach((oControl) => {
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
        OnOpenFragmentUpdate: function () {

            let oTable = this.byId("IdRestaurante")
            let oSelectedIndex = oTable.getSelectedIndex()

            if (oSelectedIndex === -1) {
                MessageToast.show("Por favor Seleccione un registro")
                return
            }

            let oRaw = oTable.getContextByIndex(oSelectedIndex).getProperty()
            let oContext = oTable.getContextByIndex(oSelectedIndex);
            // let sPath = oContext.getPath();

            let oModel = this.getOwnerComponent().getModel("mModeloDatos");
            oModel.setProperty("/nuevoRestaurante", {
                Nombre: oRaw.Nombre,
                Ubicación: oRaw.Ubicación,
                Tipo_de_comida : oRaw.Tipo_de_comida,
                Estrellas: oRaw.Estrellas,
                Cantidad_de_platos: oRaw.Cantidad_de_platos,
                Rango_de_precios: oRaw.Rango_de_precios,
                Teléfono: oRaw.Teléfono,
                Sitio_web: oRaw.Sitio_web
            });


            let oInputNombre = this.byId("IdUpdateRestaurant--_IDGenInp1ut")
            let oInputTipo = this.byId("IdUpdateRestaurant--IdFgTipoUp")
            let oInputUbicacion = this.byId("IdUpdateRestaurant--_IDG1enInput1")
            //let oInputRanking = this.byId("IdUpdateRestaurant--Ratin1gInd")
            let oInputPlatos = this.byId("IdUpdateRestaurant--_IDG1enInput2")
            let oInputPrecios = this.byId("IdUpdateRestaurant--Combo1Box")
            let oInputTelefono = this.byId("IdUpdateRestaurant--_IDGenInp5ut21")
            let oInputSitioWeb = this.byId("IdUpdateRestaurant--_IDGenfI1nput1")

            let aControls = [oInputNombre,
                oInputTipo,
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
        OnValidateDatos: function (aControlsValidate,oInputRankingValidate) {

            let bValid = true // Booleano que dira si todos las validaciones son correctas 


            aControlsValidate.forEach((oControl) => {
                oControl.setValueState("None");
            });

            aControlsValidate.forEach((oControl) => {
                if (oControl.getValue() == "" || oControl.getValue() == null) {
                    oControl.setValueState("Error")
                    oControl.setValueStateText("El campo es obligatorio")
                    bValid = false;
                }
            })

            if (oInputRankingValidate.getValue() == 0) {
                bValid = false;
                MessageBox.warning("Por favor indique Numero de Estrellas");
            }

            if (aControlsValidate[3].getValue() > 50) {

                aControlsValidate[3].setValueState("Error")
                aControlsValidate[3].setValueStateText("No se permiten mas de 50 platos")
                bValid = false;
            }

            if (!(aControlsValidate[4].getValue() == "Alto" || aControlsValidate[4].getValue() == "Medio" || aControlsValidate[4].getValue() == "Bajo")) {
                aControlsValidate[4].setValueState("Error")
                aControlsValidate[4].setValueStateText("Debe seleccionar una de las opciones")
                bValid = false;
            }

            if (aControlsValidate[5].getValue().length > 10 || aControlsValidate[5].getValue().length < 10) {
                aControlsValidate[5].setValueState("Error")
                aControlsValidate[5].setValueStateText("Ingrese un numero de telefono valido")
                bValid = false;
            }

            return bValid;

        },

        OnAddRestaurant: function () {

            let oInputNombre = this.byId("IdAddRestaurant--IdFgNombre")
            let oInputTipo = this.byId("IdAddRestaurant--IdFgTipo")
            let oInputUbicacion = this.byId("IdAddRestaurant--IdFgUbicacion")
            let oinputRanking = this.byId("IdAddRestaurant--RatingInd")
            let oInputPlatos = this.byId("IdAddRestaurant--IdFgPlatos")
            let oInputPrecios = this.byId("IdAddRestaurant--IdComboBox")
            let oInputTelefono = this.byId("IdAddRestaurant--IdFgTelefono")
            let oInputSitioWeb = this.byId("IdAddRestaurant--IdFgSitioWeb")



            let aControlsAdd = [oInputNombre,
                oInputTipo,
                oInputUbicacion,
                //oinputRanking,
                oInputPlatos,
                oInputPrecios,
                oInputTelefono,
                oInputSitioWeb]

            if (this.OnValidateDatos(aControlsAdd, oinputRanking)) {

                let oModel = this.getOwnerComponent().getModel("mModeloDatos");
                let oNewRestaurant = oModel.getProperty("/nuevoRestaurante");
                let aRestaurant = oModel.getProperty("/Restaurantes");
                const oAdd = {
                    Nombre: oNewRestaurant.Nombre,
                    Tipo_de_comida: oNewRestaurant.Tipo_de_comida,
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

                this.onCloseDialog();



            }

        },
        OnUpdateRestaurant: function () {

            let oInputNombreUp = this.byId("IdUpdateRestaurant--_IDGenInp1ut")
            let oInputTipo = this.byId("IdUpdateRestaurant--IdFgTipoUp")
            let oInputUbicacionUp = this.byId("IdUpdateRestaurant--_IDG1enInput1")
            let oInputRankingUp = this.byId("IdUpdateRestaurant--Ratin1gInd")
            let oInputPlatosUp = this.byId("IdUpdateRestaurant--_IDG1enInput2")
            let oInputPreciosUp = this.byId("IdUpdateRestaurant--Combo1Box")
            let oInputTelefonoUp = this.byId("IdUpdateRestaurant--_IDGenInp5ut21")
            let oInputSitioWebUp = this.byId("IdUpdateRestaurant--_IDGenfI1nput1")

            //let bValid = true // Booleano que dira si todos las validaciones son correctas 

            let aControlsUp = [oInputNombreUp,
                oInputTipo,
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
                    Tipo_de_comida: aControlsUp[1].getValue(),
                    Ubicación: aControlsUp[2].getValue(),
                    Estrellas: oInputRankingUp.getValue(),
                    Cantidad_de_platos: aControlsUp[3].getValue(),
                    Rango_de_precios: aControlsUp[4].getValue(),
                    Teléfono: aControlsUp[5].getValue(),
                    Sitio_web: aControlsUp[6].getValue()
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
                Tipo_de_comida: "",
                Ubicación: "",
                Estrellas: 0,
                Cantidad_de_platos: null,
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