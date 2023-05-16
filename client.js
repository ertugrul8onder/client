// var ParametersAjaxTable = function () {
//     let fv = FormValidation

//     const getUsers = function () {
//         return $.ajax({
//             url: 'https://server-rszl.onrender.com/data',
//             type: 'GET',
//             dataType: "json",
//             contentType: "application/json",
//             // headers: {
//             //     'X-Jsio-Token': '5c7ad8c2000920981b1b0269fc1c9b48'
//             // },
//             success: function (data) {
//                 console.log(data)
//             },
//             error: function (error) {
//                 console.log(error)
//             }
//         })
//     }

//     const initTable = function (data) {
//         const table = $('#crudTable')
//         const colors = ['success', 'primary', 'danger', 'warning', 'dark', 'info']
//         let method = 'post'
//         let updateDetails = {}

//         table.DataTable({
//             responsive: true,
//             data: data,
//             columns: [
//                 { title: 'First Name', data: 'first_name', width: '20%' },
//                 { title: 'Last Name', data: 'last_name', width: '20%' },
//                 { title: 'Email', data: 'email', width: '10%' },
//                 // { title: 'Hobbies', data: 'hobbies', width: '30%' },
//                 // { title: 'Actions', data: null, width: '20%' },
//             ],
//             columnDefs: [
//                 // {
//                 //     targets: 3,
//                 //     orderable: false,
//                 //     render: function (data, type, full, meta) {
//                 //         let html = ``
//                 //         let colorIndex = Math.floor(Math.random() * colors.length)

//                 //         data.forEach(function (item, i) {
//                 //             html += `<span class="label label-lg label-${colors[colorIndex]} label-inline m-1">${item}</span>`
//                 //         })

//                 //         return html
//                 //     },
//                 // },
//                 // {
//                 //     targets: 4,
//                 //     orderable: false,
//                 //     render: function (data, type, full, meta) {
//                 //         return `<a class="editButton btn btn-sm btn-light-primary m-1" title="Edit">
//                 //                     <i class="fas fa-edit"></i> Edit
//                 //                 </a>
//                 //                 <a class="deleteButton btn btn-sm btn-light-danger m-1" title="Delete">
//                 //                     <i class="fas fa-trash"></i> Delete
//                 //                 </a>`
//                 //     },
//                 // },
//             ],
//             initComplete: function () {
//                 $('#addNewButton').on('click', function () {
//                     fv.updateValidatorOption('name', 'different', 'compare', function () {
//                         return ``
//                     }).updateValidatorOption('lastname', 'different', 'compare', function () {
//                         return ``
//                     }).updateValidatorOption('age', 'different', 'compare', function () {
//                         return ``
//                     }).updateValidatorOption('hobbies', 'different', 'compare', function () {
//                         return ``
//                     })
//                 })

//                 $('#submitButton').on('click', function () {
//                     fv.validate().then(function (status) {
//                         if (status === 'Valid') {
//                             if (method === 'post') {
//                                 let formData = {
//                                     pKey: $('#name').val(),
//                                     value: $('#lastname').val(),
//                                     description: $('#age').val(),
//                                     parameterTypeId: $('#hobbies').val()
//                                 }

//                                 createParameterType(formData)
//                             } else if (method === 'update') {
//                                 let formData = {
//                                     id: updateDetails.id,
//                                     pKey: $('#PKey').val(),
//                                     value: $('#Value').val(),
//                                     description: $('#Description').val(),
//                                     parameterTypeId: $('#ParameterTypeId').val()
//                                 }

//                                 updateParameterType(updateDetails.row, formData)
//                             }
//                         }
//                     })
//                 })

//                 table.on('click', 'a.deleteButton', function () {
//                     Swal.fire({
//                         title: 'Öğeyi silmek istediğinizden emin misiniz?',
//                         reverseButtons: true,
//                         showCancelButton: true,
//                         cancelButtonText: 'Vazgeç',
//                         confirmButtonText: 'Sil',
//                         customClass: {
//                             confirmButton: 'btn btn-danger',
//                             cancelButton: 'btn btn-secondary'
//                         },
//                     }).then((result) => {
//                         if (result.isConfirmed) {
//                             let row = table.DataTable().row($(this).parents('tr'))
//                             let data = row.data()
//                             deleteParameterType(data.id, row)
//                         }
//                     })
//                 })

//                 table.on('click', 'a.editButton', function () {
//                     let row = table.DataTable().row($(this).parents('tr'))
//                     let data = row.data()

//                     $('#addNewModal').modal('show')
//                     $('#name').val(data.name)
//                     $('#lastname').val(data.lastName)
//                     $('#age').val(data.age)
//                     $('#hobbies').val(data.hobbies)

//                     fv.updateValidatorOption('name', 'different', 'compare', function () {
//                         return `${data.name}`
//                     }).updateValidatorOption('lastname', 'different', 'compare', function () {
//                         return `${data.lastName}`
//                     }).updateValidatorOption('age', 'different', 'compare', function () {
//                         return `${data.age}`
//                     }).updateValidatorOption('hobbies', 'different', 'compare', function () {
//                         return `${data.hobbies}`
//                     })

//                     updateDetails.id = data.id
//                     updateDetails.row = row
//                 })
//             },
//         })
//     }

//     const formValidation = function () {
//         const extraValidators = {
//             extraHobbie: {
//                 validators: {
//                     notEmpty: {
//                         message: 'Title is required'
//                     },
//                     stringLength: {
//                         min: 3,
//                         max: 100,
//                         message: 'Please enter a menu within text length range 3 and 100'
//                     }
//                 }
//             },
//         }

//         fv = FormValidation.formValidation(
//             document.getElementById('addNewForm'),
//             {
//                 fields: {
//                     name: {
//                         validators: {
//                             notEmpty: {
//                                 message: 'Name is required'
//                             },
//                             different: {
//                                 compare: function () {
//                                     return ''
//                                 },
//                                 message: 'Name cannot be the same'
//                             }
//                         }
//                     },
//                     lastname: {
//                         validators: {
//                             notEmpty: {
//                                 message: 'Lastname is required'
//                             },
//                             different: {
//                                 compare: function () {
//                                     return ''
//                                 },
//                                 message: 'Lastname cannot be the same'
//                             }
//                         }
//                     },
//                     age: {
//                         validators: {
//                             notEmpty: {
//                                 message: 'Age is required'
//                             },
//                             different: {
//                                 compare: function () {
//                                     return ''
//                                 },
//                                 message: 'Age cannot be the same'
//                             }
//                         }
//                     },
//                     hobbies: {
//                         validators: {
//                             notEmpty: {
//                                 message: 'Hobbies is required'
//                             },
//                             different: {
//                                 compare: function () {
//                                     return ''
//                                 },
//                                 message: 'Hobbies cannot be the same'
//                             }
//                         }
//                     },
//                 },
//                 plugins: {
//                     trigger: new FormValidation.plugins.Trigger(),
//                     bootstrap: new FormValidation.plugins.Bootstrap(),
//                     submitButton: new FormValidation.plugins.SubmitButton(),
//                 },
//             })

//         extraFormValidation(extraValidators)
//     }

//     const extraFormValidation = function (extraValidators) {
//         $('#addExtraForm').repeater({
//             initEmpty: true,
//             defaultValues: {
//                 'extraHobbie': '',
//             },
//             show: function () {
//                 let repeaterItems = $('#addExtraForm [data-repeater-item]')
//                 repeaterItems.each(function (i, item) {
//                     $(item).attr('order', i)
//                     $(item).find('.extraLabel').html(`Hobbie ${i + 1}`)
//                     fv.addField(`extraRepeater[${i}][extraHobbie]`, extraValidators.extraTitle)
//                 })
//                 $(this).slideDown()
//             },
//             hide: function (deleteElement) {
//                 let order = $(this).attr('order')
//                 let repeaterItems = $('#addExtraForm [data-repeater-item]')
//                 fv.removeField(`extraRepeater[${order}][extraHobbie]`)
//                 repeaterItems.each(function (i, item) {
//                     if ($(item).attr('order') === order) {
//                         repeaterItems.splice(i, 1)
//                     }
//                 })
//                 $(this).slideUp(deleteElement)
//             },
//         })
//     }

//     var createParameterType = function (formData) {
//         AjaxRequest("Parameter/Create", {
//             ajaxType: "POST",
//             data: formData,
//             isLocal: false,
//             sendAuthToken: true,
//             callbackFunction: function (data) {
//                 if (data.success) {
//                     table.DataTable().row.add(data.data).draw()
//                     Swal.fire('Yeni öğe başarıyla eklendi', '', 'success')
//                     $('#parameterTypeModal').modal('hide')
//                     fv.resetForm(true)
//                 } else {
//                     Swal.fire('Bir hata oluştu', '', 'error')
//                     $('#parameterTypeModal').modal('hide')
//                 }
//             }
//         })
//     }

//     var deleteParameterType = function (id, row) {
//         AjaxRequest(`Parameter/Delete?id=${id}`, {
//             ajaxType: "DELETE",
//             isLocal: false,
//             sendAuthToken: true,
//             callbackFunction: function (data) {
//                 if (data.success) {
//                     table.DataTable().row(row).remove().draw()
//                     Swal.fire('Öğe başarıyla silindi', '', 'success')
//                 } else {
//                     Swal.fire('Bir hata oluştu', '', 'error')
//                 }
//             }
//         })
//     }

//     var updateParameterType = function (row, formData) {
//         AjaxRequest(`Parameter/Update`, {
//             ajaxType: "PUT",
//             data: formData,
//             isLocal: false,
//             sendAuthToken: true,
//             callbackFunction: function (data) {
//                 if (data.success) {
//                     table.DataTable().row.add(data.data).draw()
//                     Swal.fire('Öğe başarıyla güncellendi', '', 'success')
//                     $('#parameterTypeModal').modal('hide')
//                     fv.resetForm(true)
//                 } else {
//                     Swal.fire('Bir hata oluştu', '', 'error')
//                     $('#parameterTypeModal').modal('hide')
//                 }
//             }
//         })
//     }

//     return {
//         init: async function () {
//             const data = await getUsers()
//             initTable(data)
//             formValidation()
//         },
//     }
// }()

const UsersTable = function () {
    let fv = FormValidation

    const getUsers = function () {
        return $.ajax({
            url: 'https://server-rszl.onrender.com/data',
            type: 'GET',
            dataType: "json",
            contentType: "application/json",
            // headers: {
            //     'X-Jsio-Token': '5c7ad8c2000920981b1b0269fc1c9b48'
            // },
            success: function (data) {
                console.log(data)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }

    const initTable = function (data) {
        const getColors = function () {
            const colors = ['success', 'primary', 'danger', 'warning', 'dark', 'info']
            const colorIndex = Math.floor(Math.random() * 6)
            return colors[colorIndex]
        }

        // begin first table
        const table = $('#crudTable').DataTable({
            responsive: true,
            data: data,
            buttons: [
                'print',
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5',
            ],
            columns: [
                { title: 'First Name', data: 'first_name' },
                { title: 'Last Name', data: 'last_name' },
                { title: 'Phone', data: 'phone' },
                { title: 'Email', data: 'email' },
                { title: 'Hobbies', data: 'hobbies' },
                { title: 'Actions', data: null },
            ],
            columnDefs: [
                {
                    targets: -2,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        let html = ``

                        data.forEach(function (item, i) {
                            html += `<span class="label label-lg label-${getColors()} label-inline m-1">${item}</span>`
                        })

                        return html
                    },
                },
                {
                    targets: -1,
                    orderable: false,
                    render: function (data, type, full, meta) {
                        let html =
                            `<a href="javascript:;" class="btn btn-sm btn-success btn-icon m-1" title="Print details">                                
                                <i class="la la-print"></i>
                            </a>
                            <a href="javascript:;" class="btn btn-sm btn-primary btn-icon m-1" title="Edit details">
                                <i class="la la-edit"></i>
                            </a>
                            <a href="javascript:;" class="btn btn-sm btn-danger btn-icon m-1" title="Delete">
                                <i class="la la-trash"></i>
                            </a>`
                        return html
                    },
                },
            ],
            initComplete: function () {
                // $('#addNewButton').on('click', function () {
                //     fv.updateValidatorOption('name', 'different', 'compare', function () {
                //         return ``
                //     }).updateValidatorOption('lastname', 'different', 'compare', function () {
                //         return ``
                //     }).updateValidatorOption('age', 'different', 'compare', function () {
                //         return ``
                //     }).updateValidatorOption('hobbies', 'different', 'compare', function () {
                //         return ``
                //     })
                // })
            }
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
    };

    const formValidation = function () {
        const extraValidators = {
            hobbie: {
                validators: {
                    notEmpty: {
                        message: 'Hobbie is required'
                    },
                    stringLength: {
                        min: 3,
                        max: 100,
                        message: 'Please enter a menu within text length range 3 and 100'
                    }
                }
            },
        }

        fv = FormValidation.formValidation(
            document.getElementById('addNewForm'),
            {
                fields: {
                    firstName: {
                        validators: {
                            notEmpty: {
                                message: 'Name is required'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Name cannot be the same'
                            }
                        }
                    },
                    lastName: {
                        validators: {
                            notEmpty: {
                                message: 'Last name is required'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Lastname cannot be the same'
                            }
                        }
                    },
                    phone: {
                        validators: {
                            notEmpty: {
                                message: 'Phone is required'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Age cannot be the same'
                            }
                        }
                    },
                    email: {
                        validators: {
                            notEmpty: {
                                message: 'Email is required'
                            },
                            different: {
                                compare: function () {
                                    return ''
                                },
                                message: 'Email cannot be the same'
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

        extraFormValidation(extraValidators)
    }

    const extraFormValidation = function (extraValidators) {
        $('#hobbiesRepeater').repeater({
            initEmpty: true,
            show: function () {
                let repeaterItems = $('#hobbiesRepeater [data-repeater-item]')
                repeaterItems.each(function (i, item) {
                    console.log($(item))
                    $(item).attr('order', i)
                    $(item).find('.hobbiesLabel').html(`Hobbie ${i + 1}`)
                    fv.addField(`[${i}][hobbie]`, extraValidators.hobbie)
                })
                $(this).slideDown()
            },
            hide: function (deleteElement) {
                let order = $(this).attr('order')
                let repeaterItems = $('#hobbiesRepeater [data-repeater-item]')
                fv.removeField(`[${order}][hobbie]`)
                repeaterItems.each(function (i, item) {
                    if ($(item).attr('order') === order) {
                        repeaterItems.splice(i, 1)
                    }
                })
                $(this).slideUp(deleteElement)
            },
        })
    }

    return {
        init: async function () {
            const data = await getUsers()
            initTable(data);
            formValidation()
        },
    };

}();

$(document).ready(function () {
    UsersTable.init();
})