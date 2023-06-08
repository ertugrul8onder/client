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
        removeValidators: function () {
            Object.keys(Store.Validation.getFields()).forEach(function (item) {
                if (item.includes('hobbie')) {
                    Store.Validation.removeField(item)
                }
            })
        },
        afterPost: function () {
            Store.Validation.resetForm(true)
            Store.Elements.AddNewModal.modal('hide')
        }
    },
    UpdateRow: {},
    DeleteRow: {},
    Hobbies: [],
    HobbiesFields: [],
    FormAction: '',
}

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
                            `<a href="javascript:;" class="btn btn-sm font-weight-bolder btn-light-success btn-icon m-1" title="Print details">                                
                                <i class="la la-print"></i>
                            </a>
                            <a href="javascript:;" class="editButton btn btn-sm font-weight-bolder btn-light-primary btn-icon m-1" title="Edit details">
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
                        validators: {
                            notEmpty: {
                                message: 'First name is required'
                            },
                            stringLength: {
                                max: 35,
                                message: 'Please enter a value less than 30 characters'
                            }
                        }
                    },
                    lastName: {
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            stringLength: {
                                max: 35,
                                message: 'Please enter a value less than 30 characters'
                            }
                        }
                    },
                    email: {
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
                            }
                        }
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap(),
                    submitButton: new FormValidation.plugins.SubmitButton(),
                    // message: new FormValidation.plugins.Message({
                    //     clazz: 'bg-red',
                    //     container: function (field, ele) {
                    //         // Look at the markup
                    //         // <div class="fl w-25 pa2">Label</div>
                    //         // <div class="fl w-30">Form field</div>
                    //         // <div class="fl w-40 messageContainer"></div>
                    //         return FormValidation.utils.closest(ele, '.fl').nextElementSibling;
                    //     },
                    // }),
                },
            })

        return validation
    }

    const initClickListeners = function () {
        const getHobbies = function () {
            let hobbies = []
            if (Store.Elements.HobbiesRepeater.find('[data-repeater-item]').length) {
                Store.Elements.HobbiesRepeater.repeaterVal().hobbies.forEach(function (item, i) {
                    if (item.hobbie !== '') {
                        hobbies.push(item.hobbie)
                    }
                })
            }
            return hobbies
        }

        Store.Elements.AddNewButton.on('click', function () {
            Store.FormAction = 'POST'
            Store.Elements.AddNewModal.modal('show')
            Store.Elements.AddNewModal.find('#addNewModalLabel').html('Add New Modal')
        })

        Store.Elements.SubmitButton.on('click', function () {
            Store.Validation.validate().then(async function (status) {
                if (status === 'Valid') {
                    let hobbies = getHobbies()
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
                            if (Store.Elements.HobbiesRepeater.find('[data-repeater-item]').length) {
                                Store.Elements.HobbiesRepeater.find('[data-repeater-item]').slideUp(function () {
                                    $(this).remove()
                                    Store.Functions.afterPost()
                                    Store.Functions.removeValidators()
                                    Swal.fire('Created successfully!', '', 'success')
                                })
                            } else {
                                Store.Functions.afterPost()
                                Swal.fire('Created successfully!', '', 'success')
                            }
                        })
                    } else if (Store.FormAction === 'UPDATE') {
                        formData.id = Store.UpdateRow.Data.id
                        updateUser(formData).done(function (data) {
                            Store.Table.row(Store.UpdateRow.Row).data(JSON.parse(data)).draw()
                            if (Store.Elements.HobbiesRepeater.find('[data-repeater-item]').length) {
                                Store.Elements.HobbiesRepeater.find('[data-repeater-item]').slideUp(function () {
                                    $(this).remove()
                                    Store.Functions.afterPost()
                                    Store.Functions.removeValidators()
                                    Swal.fire('Updated successfully!', '', 'success')
                                })
                            } else {
                                Store.Functions.afterPost()
                                Swal.fire('Updated successfully!', '', 'success')
                            }
                        })
                    }
                }
            })
        })

        Store.Table.on('click', 'a.deleteButton', function () {
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
                    Store.DeleteRow.Row = $(this).closest('tr').hasClass('child') ? $(this).closest('tr').prev() : $(this).closest('tr')
                    Store.DeleteRow.Data = Store.Table.row(Store.DeleteRow.Row).data()

                    let deleteData = {
                        id: Store.DeleteRow.Data.id
                    }

                    deleteUser(deleteData).done(function (data) {
                        Store.Table.row(Store.DeleteRow.Row).remove().draw()
                        Swal.fire('Deleted successfully!', '', 'success')
                        Store.DeleteRow = {}
                    })
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
        })

        Store.Elements.AddNewModal.on('shown.bs.modal', function () {
            const afterFunc = function () {
                let hobbies = []
                Store.UpdateRow.Data.hobbies.forEach(item => { hobbies.push({ hobbie: item }) })
                Store.Elements.HobbiesRepeater.setList(hobbies)
            }

            if (Store.FormAction === 'POST') {
            } else if (Store.FormAction === 'UPDATE') {
                if (Store.UpdateRow.Data.hobbies) {
                    if (Store.Elements.HobbiesRepeater.find('[data-repeater-item]').length) {
                        Store.Elements.HobbiesRepeater.find('[data-repeater-item]').slideUp(function () {
                            $(this).remove()
                            afterFunc()
                        })
                    } else {
                        afterFunc()
                    }
                }
            }
        })

        Store.Elements.AddNewModal.on('hidden.bs.modal', function () {
            if (Store.FormAction === 'UPDATE') {
                Store.Elements.HobbiesRepeater.find('[data-repeater-item]').slideUp(function () {
                    $(this).remove()
                })
                Store.Validation.resetForm(true)
                Store.UpdateRow.Data = {}
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
                // console.log(data)
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
                // console.log(data)
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
                // console.log(data)
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
                // console.log(data)
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
            getUsers().done(function (data) {
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
            }).fail(function (error) {
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
