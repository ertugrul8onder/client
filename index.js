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
    UpdateRow: {},
    DeleteRow: {},
    Hobbies: [],
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
                    width: '20%'
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
                                html += `<span class="label label-lg label-${getColors()} label-inline m-1">${item}</span>`
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
                            // different: {
                            //     compare: function () {
                            //         return ''
                            //     },
                            //     message: 'First name cannot be the same'
                            // }
                        }
                    },
                    lastName: {
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            // different: {
                            //     compare: function () {
                            //         return ''
                            //     },
                            //     message: 'Last name cannot be the same'
                            // }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            emailAddress: {
                                message: 'The value is not a valid email address'
                            }
                            // different: {
                            //     compare: function () {
                            //         return ''
                            //     },
                            //     message: 'Email cannot be the same'
                            // }
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
        const getHobbies = function () {
            let hobbies = []
            Store.Elements.HobbiesRepeater.find('input').each(function (i, item) {
                if ($(item).val() !== '') {
                    hobbies.push($(item).val())
                }
            })

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

                    const afterFunc = function () {
                        Store.Validation.resetForm(true)
                        Store.Elements.AddNewModal.modal('hide')
                    }

                    if (Store.FormAction === 'POST') {
                        postUser(formData).done(function (data) {
                            Store.Table.row.add(JSON.parse(data)).draw()
                            if (Store.Elements.HobbiesRepeater.find('[data-repeater-item]').length) {
                                Store.Elements.HobbiesRepeater.find('[data-repeater-item]').slideUp(function () {
                                    $(this).remove()
                                    afterFunc()
                                    Swal.fire('Created successfully!', '', 'success')
                                })
                            } else {
                                afterFunc()
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
                                    afterFunc()
                                    Swal.fire('Updated successfully!', '', 'success')
                                })
                            } else {
                                afterFunc()
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
        Store.Elements.HobbiesRepeater.repeater({
            initEmpty: true,
            show: function () {
                $(this).slideDown()
            },
            hide: function (deleteElement) {
                $(this).slideUp(deleteElement)
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
                Swal.fire('Bir hata oluştu', 'error')
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
                Swal.fire('Bir hata oluştu', 'error')
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
            })
        },
    };
}();

$(document).ready(function () {
    UsersTable.init();
})
