const Store = {
    Elements: {
        TableCard: $('#tableCard'),
        ExportButton: $('#exportButton'),
        AddNewButton: $('#addNewButton'),
        AddNewModal: $('#addNewModal'),
        AddNewForm: $('#addNewForm'),
        FirstName: $('#firstName'),
        LastName: $('#lastName'),
        Email: $('#email'),
        HobbiesRepeater: $('#hobbiesRepeater'),
        SubmitButton: $('#submitButton'),
    },
    Functions: {
        resetform: function () {
            this.Parent.Validation.resetForm(true)
            this.Parent.Elements.AddNewModal.modal('hide')
        },
        getRepeaterItems: function () {
            return this.Parent.Elements.HobbiesRepeater.find('[data-repeater-item]')
        },
        getHobbies: function () {
            let hobbies = []
            if (this.getRepeaterItems().length) {
                this.Parent.Elements.HobbiesRepeater.repeaterVal().hobbies.forEach(function (item, i) {
                    if (item.hobbie !== '') {
                        hobbies.push(item.hobbie)
                    }
                })
            }
            return hobbies
        },
        resetValidators: function () {
            let _this = this
            Object.keys(this.Parent.Validation.getFields()).forEach(function (item) {
                if (item.includes('hobbie')) {
                    _this.Parent.Validation.removeField(item)
                }
            })
        },
        setRepeaterItems: function () {
            let hobbies = []
            this.Parent.UpdateRow.Data.hobbies.forEach(item => { hobbies.push({ hobbie: item }) })
            this.Parent.Elements.HobbiesRepeater.setList(hobbies)
        }
    },
    UpdateRow: {},
    DeleteRow: {},
    Hobbies: [],
    HobbiesFields: [],
    FormAction: '',
    Init: function () {
        this.Functions.Parent = this
        delete this.Init
        return this
    }
}.Init()

const UsersTable = function () {
    const getColors = function () {
        const colors = ['success', 'primary', 'danger', 'warning', 'dark', 'info']
        const colorIndex = Math.floor(Math.random() * 6)
        return colors[colorIndex]
    }

    const initTable = function (data) {
        let table = $('#crudTable').DataTable({
            responsive: true,
            autoWidth: false,
            data: data,
            buttons: [
                'print',
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
            ],
            columns: [
                {
                    title: 'First Name',
                    data: 'first_name',
                    width: '20%'
                },
                {
                    title: 'Last Name',
                    data: 'last_name',
                    width: '20%',
                },
                {
                    title: 'Email',
                    data: 'email',
                    width: '20%'
                },
                {
                    title: 'Hobbies',
                    data: function (data) {
                        if (data.hobbies) {
                            return data.hobbies
                        } else {
                            return ''
                        }
                    },
                    width: '20%'
                },
                {
                    title: 'Actions',
                    data: null,
                    width: '20%'
                },
            ],
            columnDefs: [
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        let html = ``

                        if (data) {
                            data.forEach(function (item, i) {
                                html += `<span class="label label-lg label-${getColors()} label-inline p-2 m-1" style="height: auto">${item}</span>`
                            })
                        }

                        return html
                    },
                },
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        let html =
                            `<a href="javascript:;" class="editButton btn btn-sm font-weight-bolder btn-light-primary btn-icon m-1" title="Edit details">
                                <i class="la la-edit"></i>
                            </a>
                            <a href="javascript:;" class="deleteButton btn btn-sm font-weight-bolder btn-light-danger btn-icon m-1" title="Delete">
                                <i class="la la-trash"></i>
                            </a>`
                        return html
                    },
                },
            ],
        });

        $('#export_print').on('click', function (e) {
            e.preventDefault();
            table.button(0).trigger();
        });

        $('#export_copy').on('click', function (e) {
            e.preventDefault();
            table.button(1).trigger();
        });

        $('#export_excel').on('click', function (e) {
            e.preventDefault();
            table.button(2).trigger();
        });

        $('#export_csv').on('click', function (e) {
            e.preventDefault();
            table.button(3).trigger();
        });

        $('#export_pdf').on('click', function (e) {
            e.preventDefault();
            table.button(4).trigger();
        });

        return table
    };

    const initFormValidation = function () {
        let validation = FormValidation.formValidation(
            Store.Elements.AddNewForm[0],
            {
                fields: {
                    firstName: {
                        selector: '[name="firstName"]',
                        validators: {
                            notEmpty: {
                                message: 'First name is required'
                            },
                            stringLength: {
                                max: 35,
                                message: 'Please enter a value less than 30 characters'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'First name cannot be same'
                            }
                        }
                    },
                    lastName: {
                        selector: '[name="lastName"]',
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            stringLength: {
                                max: 35,
                                message: 'Please enter a value less than 30 characters'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Last name cannot be same'
                            }
                        }
                    },
                    email: {
                        selector: '[name="email"]',
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            stringLength: {
                                max: 255,
                                message: 'Please enter a value less than 256 characters'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Email name cannot be same'
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                },
            })

        return validation
    }

    const initClickListeners = function () {
        Store.Elements.AddNewButton.on('click', function () {
            Store.FormAction = 'POST'
            Store.Elements.AddNewModal.modal('show')
            Store.Elements.AddNewModal.find('#addNewModalLabel').html('Add New Modal')
        })

        Store.Elements.SubmitButton.on('click', function () {
            Store.Validation.validate().then(async function (status) {
                if (status === 'Valid') {
                    let hobbies = Store.Functions.getHobbies()
                    let formData = {
                        first_name: Store.Elements.FirstName.val(),
                        last_name: Store.Elements.LastName.val(),
                        email: Store.Elements.Email.val(),
                    }

                    if (hobbies.length) {
                        formData.hobbies = hobbies
                    }

                    if (Store.FormAction === 'POST') {
                        postUser(formData).done(function (data) {
                            Store.Table.row.add(JSON.parse(data)).draw()
                            if (Store.Functions.getRepeaterItems().length) {
                                Store.Functions.getRepeaterItems().slideUp(function () {
                                    Store.Functions.resetform()
                                    Store.Functions.resetValidators()
                                    Swal.fire('Created successfully!', '', 'success')
                                })
                            } else {
                                Store.Functions.resetform()
                                Swal.fire('Created successfully!', '', 'success')
                            }
                        })
                    } else if (Store.FormAction === 'UPDATE') {
                        formData.id = Store.UpdateRow.Data.id
                        updateUser(formData).done(function (data) {
                            Store.Table.row(Store.UpdateRow.Row).data(JSON.parse(data)).draw()
                            if (Store.Functions.getRepeaterItems().length) {
                                Store.Functions.getRepeaterItems().slideUp(function () {
                                    Store.Functions.resetform()
                                    Store.Functions.resetValidators()
                                    Store.UpdateRow = {}
                                    Swal.fire('Updated successfully!', '', 'success')
                                })
                            } else {
                                Store.Functions.resetform()
                                Store.UpdateRow = {}
                                Swal.fire('Updated successfully!', '', 'success')
                            }
                        })
                    }
                }
            })
        })

        Store.Table.on('click', 'a.deleteButton', function () {
            Store.DeleteRow.Row = $(this).closest('tr').hasClass('child') ? $(this).closest('tr').prev() : $(this).closest('tr')
            Store.DeleteRow.Data = Store.Table.row(Store.DeleteRow.Row).data()

            Swal.fire({
                title: 'Do you want to delete object?',
                reverseButtons: true,
                showCancelButton: true,
                cancelButtonText: 'Cancel',
                confirmButtonText: 'Delete',
                customClass: {
                    confirmButton: 'btn btn-danger',
                    cancelButton: 'btn btn-secondary'
                },
            }).then((result) => {
                if (result.isConfirmed) {
                    let deleteData = {
                        id: Store.DeleteRow.Data.id
                    }

                    deleteUser(deleteData).done(function (data) {
                        Store.Table.row(Store.DeleteRow.Row).remove().draw()
                        Store.DeleteRow = {}
                        Swal.fire('Deleted successfully!', '', 'success')
                    })
                } else {
                    Store.DeleteRow = {}
                }
            })
        })

        Store.Table.on('click', 'a.editButton', function () {
            Store.FormAction = 'UPDATE'
            Store.Elements.AddNewModal.modal('show')
            Store.Elements.AddNewModal.find('#addNewModalLabel').html('Edit Modal')

            Store.UpdateRow.Row = $(this).closest('tr').hasClass('child') ? $(this).closest('tr').prev() : $(this).closest('tr')
            Store.UpdateRow.Data = Store.Table.row(Store.UpdateRow.Row).data()

            Store.Validation.resetForm(true)

            Store.Elements.FirstName.val(Store.UpdateRow.Data.first_name)
            Store.Elements.LastName.val(Store.UpdateRow.Data.last_name)
            Store.Elements.Email.val(Store.UpdateRow.Data.email)

            // Store.Validation.addField('noSame', {
            //     selector: '.noSame',
            //     validators: {
            //         callback: {
            //             message: 'You need to make at least one change',
            //             callback: function (input) {
            //                 let valid = false;

            //                 if (input.element.value !== Store.UpdateRow.Data.first_name) {
            //                     console.log("asd")
            //                     valid = true
            //                     return
            //                 } else if (input.element.value !== Store.UpdateRow.Data.last_name) {
            //                     console.log("asd")
            //                     valid = true
            //                     return
            //                 } else if (input.element.value !== Store.UpdateRow.Data.email) {
            //                     console.log("asd")
            //                     valid = true
            //                     return
            //                 }

            //                 if (valid) {
            //                     Store.Validation.updateFieldStatus('noSame', 'Valid', 'callback');
            //                     return true;
            //                 }

            //                 return false;
            //             }
            //         },
            //     },
            // })

            // Store.Validation.updateValidatorOption('firstName', 'different', 'compare', function () {
            //     return `${Store.UpdateRow.Data.first_name}`
            // }).updateValidatorOption('lastName', 'different', 'compare', function () {
            //     return `${Store.UpdateRow.Data.last_name}`
            // }).updateValidatorOption('email', 'different', 'compare', function () {
            //     return `${Store.UpdateRow.Data.email}`
            // })
        })

        Store.Elements.AddNewModal.on('shown.bs.modal', function () {
            if (Store.FormAction === 'UPDATE') {
                if (Store.UpdateRow.Data.hobbies) {
                    if (Store.Functions.getRepeaterItems().length) {
                        Store.Functions.getRepeaterItems().slideUp(function () {
                            $(this).remove()
                            Store.Functions.resetValidators()
                            Store.Functions.setRepeaterItems()
                        })
                    } else {
                        Store.Functions.setRepeaterItems()
                    }
                }
            }
        })

        Store.Elements.AddNewModal.on('hidden.bs.modal', function () {
            if (Store.FormAction === 'UPDATE') {
                if (Store.Functions.getRepeaterItems().length) {
                    Store.Functions.getRepeaterItems().slideUp(function () {
                        $(this).remove()
                        Store.Functions.resetValidators()
                    })
                }

                Store.Validation.resetForm(true)
                // Store.Validation.updateValidatorOption('firstName', 'different', 'compare', function () {
                //     return ''
                // }).updateValidatorOption('lastName', 'different', 'compare', function () {
                //     return ''
                // }).updateValidatorOption('email', 'different', 'compare', function () {
                //     return ''
                // })
                Store.UpdateRow = {}
            }
        })
    }

    const initFormRepeater = function () {
        let order = 0
        Store.Elements.HobbiesRepeater.repeater({
            initEmpty: true,
            show: function () {
                order++
                let hobbieValidator = {
                    selector: `[order='${order}']`,
                    validators: {
                        notEmpty: {
                            message: 'Hobbie name is required'
                        },
                        stringLength: {
                            max: 25,
                            message: 'Please enter a value less than 25 characters'
                        }
                    },
                }
                $(this).slideDown()
                $(this).find('input').attr('order', order)
                Store.Validation.addField(`hobbie[${order}]`, hobbieValidator)
                // console.log(Store.Validation.fields)
            },
            hide: function (deleteElement) {
                $(this).slideUp(deleteElement)
                Store.Validation.removeField(`hobbie[${$(this).find('input').attr('order')}]`)
                // console.log(Store.Validation.fields)
            },
        })
    }

    const getUsers = function () {
        return $.ajax({
            url: 'https://api.ertugrulonder.com/data',
            type: 'GET',
            dataType: "json",
            contentType: "application/json",
            success: function (data) {
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    const postUser = function (formData) {
        return $.ajax({
            url: 'https://api.ertugrulonder.com/data',
            type: 'POST',
            data: JSON.stringify(formData),
            dataType: "text",
            contentType: "application/json",
            success: function (data) {
            },
            error: function (error) {
                console.log(error)
                Swal.fire('An error occurred', 'error')
                Store.Elements.AddNewModal.modal('hide')
            }
        })
    }

    const deleteUser = function (deleteData) {
        return $.ajax({
            url: 'https://api.ertugrulonder.com/data',
            type: 'DELETE',
            data: JSON.stringify(deleteData),
            dataType: "text",
            contentType: "application/json",
            success: function (data) {
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    const updateUser = function (updateData) {
        return $.ajax({
            url: 'https://api.ertugrulonder.com/data',
            type: 'PUT',
            data: JSON.stringify(updateData),
            dataType: "text",
            contentType: "application/json",
            success: function (data) {
            },
            error: function (error) {
                console.log(error)
                Swal.fire('An error occurred', 'error')
                Store.Elements.AddNewModal.modal('hide')
            }
        })
    }

    return {
        init: function () {
            getUsers()
                .done(function (data) {
                    let tableData = Object.values(data)
                    let tableKeys = Object.keys(data)

                    tableData.forEach((item, i) => {
                        item.id = tableKeys[i]
                    });

                    Store.Elements.TableCard.removeClass('gradient')
                    Store.Elements.ExportButton.removeClass('disabled')
                    Store.Elements.AddNewButton.removeClass('disabled')

                    Store.Table = initTable(tableData)
                    Store.Validation = initFormValidation()

                    initFormRepeater()
                    initClickListeners()
                })
                .fail(function (error) {
                    console.log(error)
                    Swal.fire('Cannot get data', 'error')
                    Store.Elements.TableCard.removeClass('gradient')
                })
        },
    };
}();

$(document).ready(function () {
    UsersTable.init();
})
