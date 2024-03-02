// Variables
let addEmployeeModal = $('#addEmployeeModal')
let editEmployeeModal = $('#editEmployeeModal')
let addDepartmentModal = $('#addDepartmentModal')
let editDepartmentModal = $('#editDepartmentModal')
let addLocationModal = $('#addLocationModal')

// Load Tables
function showAllEmployees() {
  $.ajax({
    url: 'libs/php/getAll.php',
    type: 'GET',
    dataType: 'json',
    success: function (e) {
      if ('ok' == e.status.name) {
        const t = e.data
        let a = $('#employeeTbody')
        a.html('')
        let o = $('#total-entries')
        t.forEach(e => {
          a.append(
            $(
              `<tr role="button" data-id="${e.id}">\n 
                <td>${e.lastName}, ${e.firstName}</td>\n
                <td>${e.department}</td>\n 
                <td>${e.location}</td>\n                                            
                </tr>`
            )
          )
        })
        const n = $('#employeeTbody tr:visible').length
        o.html($(`<h5>${n} <i class='fas fa-user-friends'></i></h5>`))
      }
    },
    error: function (e, t, a) {},
  })
}
function showDepartments() {
  $.ajax({
    url: 'libs/php/getAllDepartments.php',
    type: 'GET',
    dataType: 'json',
    success: function (e) {
      if ('ok' == e.status.name) {
        const t = e.data
        let a = $('#select-departments')
        a.html('')
        let o = $('#departments-cards')
        o.html('')
        let n = $('#addEmployeeDepartmentSelect')
        n.html('')
        let d = $('#editEmployeeDepartmentSelect')
        d.html(''),
          t.forEach(e => {
            a.append($(`<option value="${e.id}">${e.name}</option>`)),
              o.append(
                $(
                  `<div id="department-details-card" class="details-card">\n
                   
                   <div class="card-body">\n
                   <h6 class="card-title department-name text-center mb-3"><strong>${e.name}</strong></h6>\n
                   <table class="dept-table table justify-content-between">\n
                   <tbody id="dept-tbody">\n
                   <tr class=''>\n                                                                                                                                                     
                   <td class="align-middle text-center">${e.location}</td>    \n                                                                        
                   </tr>\n                                                                
                   </tbody>\n                                                            
                   </table> \n                                                            
                   <div class="d-flex justify-content-center w-100 flex-nowrap p-1">\n                                                                
                   <button id="dept-pencil-edit" class="btn btn-primary w-50 updateDepartmentIcon" type="button"\n                                                                    
                   data-departmentid="${e.id}"\n                                                                    
                   data-name="${e.name}"\n                                                                    
                   data-location="${e.location}"\n                                                                    
                   data-locationID="${e.locationID}">\n                                                                                      
                   Update                                                               
                   </button>\n                                                                
                   <button id="dept-bin-delete" class="btn btn-danger w-50 deleteDepartmentIcon" type="button" data-name="${e.name}" data-departmentid="${e.id}">\n                                                                    
                   Delete                                                               
                   </button>\n                                                            
                   </div>  \n                                                        
                   </div>    \n                                                    
                   </div>`
                )
              ),
              n.append($(`<option data-departmentid="${e.id}" value="${e.locationID}">${e.name}</option>`)),
              d.append($(`<option data-departmentid="${e.id}" value="${e.locationID}">${e.name}</option>`))
          }),
          a.prepend($('<option selected disabled value="0">Search by Department</option>')),
          n.prepend($('<option selected disabled value="0"></option>')),
          d.prepend($('<option value="0"></option>')),
          $('.updateDepartmentIcon').on('click', function () {
            let e = $(this).attr('data-departmentid'),
              t = $(this).attr('data-name'),
              a = $(this).attr('data-location'),
              o = $(this).attr('data-locationID')
            $('#id_ud').val(e),
              $('#departmentName_ud').val(t),
              $('#editDepartmentLocationSelect option:first').replaceWith($(`<option selected disabled value="${o}">${a}</option>`)),
              editDepartmentModal.modal('show'),
              $('#editDepartmentForm').validate().resetForm(),
              $('#updateDepartmentBtn').attr('disabled', !0),
              $('#checkConfirmEditDepartment').prop('checked', !1)
          }),
          $('#checkConfirmDeleteDepartment').click(function () {
            $(this).is(':checked') ? $('#deleteDepartmentBtn').attr('disabled', !1) : $('#deleteDepartmentBtn').prop('disabled', !0)
          }),
          $('#deleteDepartmentModal').on('hidden.bs.modal', function () {
            $('#checkConfirmDeleteDepartment').is(':checked') &&
              ($('#deleteDepartmentBtn').attr('disabled', !0), $(this).find('form').trigger('reset'))
          }),
          $('.deleteDepartmentIcon').on('click', function () {
            let e = $(this).attr('data-departmentid')
            let p = $(this).attr('data-name')
            $('#id_dd').val(e)
            let t = $('#id_dd').val()
            $.ajax({
              url: 'libs/php/deleteDepartmentCheck.php',
              type: 'POST',
              dataType: 'json',
              data: { id: t },
              beforeSend: function () {},
              success: function (e) {
                if (e['data'] > 0) {
                  $('#forbiddenDepartmentModal').modal('show')
                  $('.depName').html(`(${p})`)
                } else {
                  $('#deleteDepartmentModal').modal('show')
                  $('.depName').html(`${p}?`)
                  $('#deleteDepartmentBtn').on('click', function () {
                    $.ajax({
                      url: 'libs/php/deleteDepartment.php',
                      type: 'POST',
                      dataType: 'json',
                      data: { id: t },
                      beforeSend: function () {},
                      success: function (e) {
                        $('#deleteDepartmentModal').modal('hide'), showDepartments()
                      },
                      complete: function () {
                        $('#loader').addClass('hidden')
                      },
                      error: function (e, t, a) {},
                    })
                  })
                }
              },
              complete: function () {
                $('#loader').addClass('hidden')
              },
              error: function (e, t, a) {},
            })
          })
      }
    },
    error: function (e, t, a) {},
  })
}

function showLocations() {
  $.ajax({
    url: 'libs/php/getAllLocations.php',
    type: 'GET',
    dataType: 'json',
    success: function (e) {
      if ('ok' == e.status.name) {
        const t = e.data
        let a = $('#select-locations')
        a.html('')
        let o = $('#locations-cards')
        o.html('')
        let n = $('#addEmployeeLocationSelect')
        n.html('')
        let d = $('#editEmployeeLocationSelect')
        d.html('')
        let l = $('#editDepartmentLocationSelect')
        l.html('')
        let i = $('#addDepartmentLocationSelect')
        i.html(''),
          t.forEach(e => {
            a.append($(`<option value="${e.id}">${e.name}</option>`)),
              o.append(
                $(
                  `<div id="location-details-card" class="details-card">\n                                                                                                          
                  <div class="card-body">\n                                                            
                  <h5 class="card-title location-name text-center mb-3"><strong>${e.name}</strong></h5>\n                                                            
                  <div class="text-center p-1">\n                                                                
                  <button id="loc-bin-delete" class="btn btn-danger w-50 deleteLocationIcon " type="button" data-id="${e.id}" name-id="${e.name}">\n                                                                    
                  Delete                                                               
                  </button>\n                                                            
                  </div>  \n                                                        
                  </div>    \n                                                    
                  </div>`
                )
              ),
              n.append($(`<option value="${e.id}">${e.name}</option>`)),
              d.append($(`<option value="${e.id}">${e.name}</option>`)),
              l.append($(`<option value="${e.id}">${e.name}</option>`)),
              i.append($(`<option value="${e.id}">${e.name}</option>`))
          }),
          a.prepend($('<option selected disabled value="0"></option>')),
          n.prepend($('<option selected disabled value="0"></option>')),
          d.prepend($('<option value="0"></option>')),
          l.prepend($('<option value="0"></option>')),
          i.prepend($('<option selected disabled value="0"></option>')),
          $('#checkConfirmDeleteLocation').click(function () {
            $(this).is(':checked') ? $('#deleteLocationBtn').attr('disabled', !1) : $('#deleteLocationBtn').prop('disabled', !0)
          }),
          $('#deleteLocationModal').on('hidden.bs.modal', function () {
            $('#checkConfirmDeleteLocation').is(':checked') &&
              ($('#deleteLocationBtn').attr('disabled', !0), $(this).find('form').trigger('reset'))
          }),
          $('.deleteLocationIcon').on('click', function () {
            let e = $(this).attr('data-id')
            let p = $(this).attr('name-id')
            $('#id_dl').val(e)
            let t = $('#id_dl').val()
            $.ajax({
              url: 'libs/php/deleteLocationCheck.php',
              type: 'POST',
              dataType: 'json',
              data: { id: t },
              beforeSend: function () {
                $('#loader').removeClass('hidden')
              },
              success: function (e) {
                if (e['data'] > 0) {
                  $('#forbiddenLocationModal').modal('show')
                  $('.locName').html(`(${p})`)
                } else {
                  $('#deleteLocationModal').modal('show')
                  $('.locName').html(`${p}?`)
                  $('#deleteLocationBtn').on('click', function () {
                    $.ajax({
                      url: 'libs/php/deleteLocation.php',
                      type: 'POST',
                      dataType: 'json',
                      data: { id: t },
                      beforeSend: function () {
                        $('#loader').removeClass('hidden')
                      },
                      success: function (e) {
                        $('#deleteLocationModal').modal('hide'), showLocations()
                      },
                      complete: function () {
                        $('#loader').addClass('hidden')
                      },
                      error: function (e, t, a) {},
                    })
                  })
                }
              },
              complete: function () {
                $('#loader').addClass('hidden')
              },
              error: function (e, t, a) {},
            })
          })
      }
    },
    error: function (e, t, a) {},
  })
}

function inputSearchDL(e, t) {
  e.on('keyup', function (e) {
    const a = e.target.value
    document.querySelectorAll(t).forEach(e => {
      e.innerText.toLowerCase().includes(a.toLowerCase())
        ? (e.parentElement.parentElement.style.display = 'block')
        : (e.parentElement.parentElement.style.display = 'none')
    })
  })
}
function toTitleCase(e) {
  return e.replace(/\w\S*/g, function (e) {
    return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
  })
}
function resetModal(e) {
  e.on('hidden.bs.modal', function () {
    $(this).find('form').trigger('reset')
  })
}
$(window).on('load', function () {
  $('#preloader').delay(1000).fadeOut('slow'), showAllEmployees(), showDepartments(), showLocations()
}),
  $('#btn-employees').on('click', function () {
    $(this).addClass('itsLive'),
      $('#btn-departments').removeClass('itsLive'),
      $('#btn-locations').removeClass('itsLive'),
      $('#all-employees').removeClass('d-none'),
      $('#all-departments').addClass('d-none'),
      $('#all-locations').addClass('d-none'),
      $('.navbar-collapse.show').collapse('hide'),
      showAllEmployees()
  }),
  $('.table').on('click', "tr[role='button']", function () {
    let e = $(this).attr('data-id')
    $.ajax({
      url: 'libs/php/getPersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: { id: e },
      success: function (e) {
        if ('ok' == e.status.name) {
          let t = e.data[0],
            a = $('#ed-content')
          a.html(''),
            a.html(
              $(
                `<div class="modal-header bg-primary">\n
                <h4 class="modal-title text-white" id="viewEmployeeModalLabel">Employee Details</h4>\n
                <button type="button"  class="btn left-arrow" title="Back" data-bs-dismiss="modal" aria-label="Close">
                <i class='fa fa-times'></i></button>\n
                </div>\n
               
                <div class="card-body d-flex justify-content-center p-0" id="ed-name">\n
                <h3 class="card-title p-2 "><strong>${t.firstName}</strong></h3>\n
                <h3 class="card-title p-2"><strong>${t.lastName}</strong></h3>\n  
                </div>\n                                               
                <div class="d-flex justify-content-center">\n
                <table class="ed-table table table-responsive d-flex justify-content-center">\n
                <tbody id="ed-tbody" class='border-0 w-100'>\n
                <tr class='row'>\n
                <td class='col-2 border-0'</td>\n
                <td class='col-4 border-0'>Job Title</td>\n
                <td class="col-6 align-middle border-0">${t.jobTitle}</td>\n
                </tr>\n
                <tr class='row'>\n
                <td class='col-2 border-0'</td>\n
                <td class='col-4 border-0'>Email</td>\n
                <td class="col-6 align-middle border-0">${t.email}</td>\n   
                </tr>\n
                <tr class='row'>\n 
                <td class='col-2 border-0'</td>\n
                <td class='col-4 border-0'>Department</td>\n
                <td class="col-6 align-middle border-0">${t.department}</td>    \n
                </tr>\n
                <tr class='row'>\n
                <td class='col-2 border-0'</td>\n
                <td class='col-4 border-0'>Location</td>\n
                <td class="col-6 align-middle border-0">${t.location}</td>    \n
                </tr>\n
                </tbody>\n
                </table>   \n
                </div>  \n
                </div>\n 
                </div>\n 
                </div>\n
                <div class="modal-footer justify-content-center flex-nowrap w-100">\n
                <button id="ed-pencil-edit" class="btn editE btn-primary w-50" type="button"\n
                data-id="${t.id}"\n
                data-firstName="${t.firstName}" \n
                data-lastName="${t.lastName}"\n
                data-jobTitle="${t.jobTitle}" \n
                data-email="${t.email}" \n
                data-department="${t.department}"\n
                data-departmentid="${t.departmentID}"\n
                data-location="${t.location}"\n
                data-locationID="${t.locationID}">\n
                Update
                </button>\n
                <button id="ed-bin-delete" class="btn deleteE btn-danger w-50" type="button" data-id="${t.id}">\n
                Delete
                </button>\n
                </div>`
              )
            ),
            $('.editE').on('click', function () {
              let e = $(this).attr('data-id'),
                t = $(this).attr('data-firstName'),
                a = $(this).attr('data-lastName'),
                o = $(this).attr('data-jobTitle'),
                n = $(this).attr('data-email'),
                d = $(this).attr('data-department'),
                l = $(this).attr('data-departmentid'),
                i = $(this).attr('data-location'),
                s = $(this).attr('data-locationID')
              $('#id_u').val(e),
                $('#firstName_u').val(t),
                $('#lastName_u').val(a),
                $('#jobTitle_u').val(o),
                $('#email_u').val(n),
                $('#editEmployeeDepartmentSelect option:first').replaceWith(
                  $(`<option selected disabled data-departmentid="${l}" value="${s}">${d}</option>`)
                ),
                $('#editEmployeeLocationSelect option:first').replaceWith($(`<option selected value="${s}">${i}</option>`)),
                editEmployeeModal.modal('show'),
                $('#viewEmployeeModal').modal('hide'),
                $('#editEmployeeForm').validate().resetForm(),
                $('#updateEmployeeBtn').attr('disabled', !0),
                $('#checkConfirmEditEmployee').prop('checked', !1)
            }),
            $('.deleteE').on('click', function () {
              let e = $(this).attr('data-id')
              $('#id_d').val(e),
                $('.fullName').html(`${t.firstName} ${t.lastName}?`),
                $('#deleteEmployeeModal').modal('show'),
                $('#viewEmployeeModal').modal('hide')
            })
        }
      },
      error: function (e, t, a) {},
    }),
      $('#viewEmployeeModal').modal('show')
  }),
  $('#addEmployeeDepartmentSelect').change(function () {
    $('#addEmployeeLocationSelect option').hide(),
      $("#addEmployeeLocationSelect option[value='" + $(this).val() + "']").show(),
      $("#addEmployeeLocationSelect option[value='" + $(this).val() + "']").length
        ? $("#addEmployeeLocationSelect option[value='" + $(this).val() + "']")
            .first()
            .prop('selected', !0)
        : $('#addEmployeeLocationSelect').val('')
  }),
  $('#checkConfirmAddEmployee').click(function () {
    $('#addEmployeeForm').valid() && $(this).is(':checked')
      ? $('#employeeConfirmAddBtn').attr('disabled', !1)
      : ($('#employeeConfirmAddBtn').attr('disabled', !0), $('#checkConfirmAddEmployee').prop('checked', !1)),
      $('#firstNameInput, #lastNameInput, #jobTitleInput, #emailInput').keyup(function () {
        let e = $('#firstNameInput').val(),
          t = $('#lastNameInput').val(),
          a = $('#jobTitleInput').val(),
          o = $('#emailInput').val()
        ;('' !== e && '' !== t && '' !== a && '' !== o) ||
          ($('#employeeConfirmAddBtn').attr('disabled', !0), $('#checkConfirmAddEmployee').prop('checked', !1))
      })
  }),
  $('#add-employee').click(function () {
    addEmployeeModal.modal('show'),
      resetModal(addEmployeeModal),
      $('#addEmployeeForm').validate().resetForm(),
      $('#employeeConfirmAddBtn').attr('disabled', !0)
  }),
  $('#employeeConfirmAddBtn').click(function (e) {
    e.preventDefault(),
      $.ajax({
        url: 'libs/php/insertPersonnel.php',
        type: 'POST',
        dataType: 'json',
        data: {
          firstName: toTitleCase($('#firstNameInput').val()),
          lastName: toTitleCase($('#lastNameInput').val()),
          jobTitle: toTitleCase($('#jobTitleInput').val()),
          email: $('#emailInput').val().toLowerCase(),
          departmentID: $('#addEmployeeDepartmentSelect :selected').data('departmentid'),
        },
        beforeSend: function () {
          $('#loader').removeClass('hidden')
        },
        success: function (e) {
          'ok' == e.status.name && (addEmployeeModal.modal('hide'), showAllEmployees())
        },
        complete: function () {
          $('#loader').addClass('hidden')
        },
        error: function (e, t, a) {},
      })
  }),
  $('#editEmployeeDepartmentSelect').change(function () {
    $('#editEmployeeLocationSelect option').hide(),
      $("#editEmployeeLocationSelect option[value='" + $(this).val() + "']").show(),
      $("#editEmployeeLocationSelect option[value='" + $(this).val() + "']").length
        ? $("#editEmployeeLocationSelect option[value='" + $(this).val() + "']")
            .first()
            .prop('selected', !0)
        : $('#editEmployeeLocationSelect').val('')
  }),
  $('#checkConfirmEditEmployee').click(function () {
    $('#editEmployeeForm').valid() && $(this).is(':checked')
      ? $('#updateEmployeeBtn').attr('disabled', !1)
      : ($('#updateEmployeeBtn').attr('disabled', !0), $('#checkConfirmEditEmployee').prop('checked', !1)),
      $('#firstName_u, #lastName_u, #jobTitle_u, #email_u').keyup(function () {
        let e = $('#firstName_u').val(),
          t = $('#lastName_u').val(),
          a = $('#jobTitle_u').val(),
          o = $('#email_u').val()
        ;('' !== e && '' !== t && '' !== a && '' !== o) ||
          ($('#updateEmployeeBtn').attr('disabled', !0), $('#checkConfirmEditEmployee').prop('checked', !1))
      })
  }),
  $('#updateEmployeeBtn').on('click', function (e) {
    e.preventDefault()
    let t = $('#id_u').val(),
      a = $('#editEmployeeDepartmentSelect :selected').data('departmentid')
    $.ajax({
      url: 'libs/php/updatePersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: {
        firstName: toTitleCase($('#firstName_u').val()),
        lastName: toTitleCase($('#lastName_u').val()),
        jobTitle: toTitleCase($('#jobTitle_u').val()),
        email: $('#email_u').val().toLowerCase(),
        departmentID: a,
        id: t,
      },
      beforeSend: function () {
        $('#loader').removeClass('hidden')
      },
      success: function (e) {
        'ok' == e.status.name && (editEmployeeModal.modal('hide'), $('#viewEmployeeModal').modal('hide'), showAllEmployees())
      },
      complete: function () {
        $('#loader').addClass('hidden')
      },
      error: function (e, t, a) {},
    })
  }),
  $('#checkConfirmDeleteEmployee').click(function () {
    $(this).is(':checked') ? $('#deleteEmployeeBtn').attr('disabled', !1) : $('#deleteEmployeeBtn').prop('disabled', !0)
  }),
  $('#deleteEmployeeModal').on('hidden.bs.modal', function () {
    $('#checkConfirmDeleteEmployee').is(':checked') &&
      ($('#deleteEmployeeBtn').attr('disabled', !0), $(this).find('form').trigger('reset')),
      $('#viewEmployeeModal').removeClass('dm-overlay')
  }),
  $('#deleteEmployeeBtn').on('click', function (e) {
    e.preventDefault()
    let t = $('#id_d').val()
    $.ajax({
      url: 'libs/php/deletePersonnel.php',
      type: 'POST',
      dataType: 'json',
      data: { id: t },
      beforeSend: function () {
        $('#loader').removeClass('hidden')
      },
      success: function (e) {
        'ok' == e.status.name && ($('#deleteEmployeeModal').modal('hide'), $('#viewEmployeeModal').modal('hide'), showAllEmployees())
      },
      complete: function () {
        $('#loader').addClass('hidden')
      },
      error: function (e, t, a) {},
    })
  }),
  $('#btn-departments').on('click', function () {
    $(this).addClass('itsLive'),
      $('#btn-employees').removeClass('itsLive'),
      $('#btn-locations').removeClass('itsLive'),
      $('#all-departments').removeClass('d-none'),
      $('#all-employees').addClass('d-none'),
      $('#all-locations').addClass('d-none'),
      $('.navbar-collapse.show').collapse('hide')
  }),
  $('#checkConfirmAddDepartment').click(function () {
    $('#addDepartmentForm').valid() && $(this).is(':checked')
      ? $('#addDepartmentBtn').attr('disabled', !1)
      : ($('#addDepartmentBtn').attr('disabled', !0), $('#checkConfirmAddDepartment').prop('checked', !1)),
      $('#departmentName_addd').keyup(function () {
        '' === $(this).val() && ($('#checkConfirmAddDepartment').prop('checked', !1), $('#addDepartmentBtn').attr('disabled', !0))
      })
  }),
  $('#add-department').click(function () {
    addDepartmentModal.modal('show'),
      resetModal(addDepartmentModal),
      $('#addDepartmentForm').validate().resetForm(),
      $('#addDepartmentBtn').attr('disabled', !0)
  }),
  $('#addDepartmentBtn').on('click', function (e) {
    e.preventDefault()
    let t = $('#addDepartmentLocationSelect :selected').val()
    $.ajax({
      url: 'libs/php/insertDepartment.php',
      type: 'POST',
      dataType: 'json',
      data: { name: toTitleCase($('#departmentName_addd').val()), locationID: t },
      beforeSend: function () {
        $('#loader').removeClass('hidden')
      },
      success: function (e) {
        'ok' == e.status.name && (addDepartmentModal.modal('hide'), showDepartments())
      },
      complete: function () {
        $('#loader').addClass('hidden')
      },
      error: function (e, t, a) {},
    })
  }),
  $('#checkConfirmEditDepartment').click(function () {
    $('#editDepartmentForm').valid() && $(this).is(':checked')
      ? $('#updateDepartmentBtn').attr('disabled', !1)
      : ($('#updateDepartmentBtn').attr('disabled', !0), $('#checkConfirmEditDepartment').prop('checked', !1)),
      $('#departmentName_ud').keyup(function () {
        '' === $(this).val() && ($('#updateDepartmentBtn').attr('disabled', !0), $('#checkConfirmEditDepartment').prop('checked', !1))
      })
  }),
  $('#updateDepartmentBtn').on('click', function (e) {
    e.preventDefault()
    let t = $('#id_ud').val(),
      a = $('#editDepartmentLocationSelect :selected').val()
    $.ajax({
      url: 'libs/php/updateDepartment.php',
      type: 'POST',
      dataType: 'json',
      data: { name: toTitleCase($('#departmentName_ud').val()), locationID: a, id: t },
      beforeSend: function () {
        $('#loader').removeClass('hidden')
      },
      success: function (e) {
        'ok' == e.status.name && (editDepartmentModal.modal('hide'), showDepartments())
      },
      complete: function () {
        $('#loader').addClass('hidden')
      },
      error: function (e, t, a) {},
    })
  }),
  $('#btn-locations').on('click', function () {
    $(this).addClass('itsLive'),
      $('#btn-employees').removeClass('itsLive'),
      $('#btn-departments').removeClass('itsLive'),
      $('#all-locations').removeClass('d-none'),
      $('#all-departments').addClass('d-none'),
      $('#all-employees').addClass('d-none'),
      $('.navbar-collapse.show').collapse('hide')
  }),
  $('#checkConfirmAddLocation').click(function () {
    $('#addLocationForm').valid() && $(this).is(':checked')
      ? $('#addLocationBtn').attr('disabled', !1)
      : ($('#addLocationBtn').attr('disabled', !0), $('#checkConfirmAddLocation').prop('checked', !1)),
      $('#locationName_addl').keyup(function () {
        '' === $(this).val() && ($('#checkConfirmAddLocation').prop('checked', !1), $('#addLocationBtn').attr('disabled', !0))
      })
  }),
  $('#add-location').click(function () {
    addLocationModal.modal('show'),
      resetModal(addLocationModal),
      $('#addLocationForm').validate().resetForm(),
      $('#addLocationBtn').attr('disabled', !0)
  }),
  $('#addLocationBtn').on('click', function (e) {
    e.preventDefault(),
      $.ajax({
        url: 'libs/php/insertLocation.php',
        type: 'POST',
        dataType: 'json',
        data: { name: toTitleCase($('#locationName_addl').val()) },
        beforeSend: function () {
          $('#loader').removeClass('hidden')
        },
        success: function (e) {
          'ok' == e.status.name && (addLocationModal.modal('hide'), showLocations())
        },
        complete: function () {
          $('#loader').addClass('hidden')
        },
        error: function (e, t, a) {},
      })
  }),
  $('#search-input').on('keyup', function () {
    let e = $('#employeeTbody tr'),
      t = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase()
    e.show()
      .filter(function () {
        return !~$(this).text().replace(/\s+/g, ' ').toLowerCase().indexOf(t)
      })
      .hide()
    let a = $('#total-entries'),
      o = $('#employeeTbody tr:visible').length
    1 == o ? a.html($(`<h5>${o} employee</h5>`)) : a.html($(`<h5>${o} employees</h5>`))
  }),
  $('#search-input').on('focus', function () {
    showAllEmployees(),
      $('#select-locations option').each(function () {
        if (this.defaultSelected) return (this.selected = !0), !1
      }),
      $('#select-departments option').each(function () {
        if (this.defaultSelected) return (this.selected = !0), !1
      })
  }),
  inputSearchDL($('#search-input-department'), '.department-name'),
  inputSearchDL($('#search-input-location'), '.location-name'),
  $('#select-departments').on('change', function () {
    $('#select-locations option').each(function () {
      if (this.defaultSelected) return (this.selected = !0), !1
    })
    let e = $('#total-entries'),
      t = $('#employeeTbody tr').length
    e.html($(`<h5>${t} employees</h5>`))
    let a = $('#select-departments :selected').text()
    $('table')[a ? 'show' : 'hide'](),
      a &&
        $.each($('#employeeTable tbody tr'), function (o, n) {
          $(n)[$(n).is(':contains(' + a + ')') ? 'show' : 'hide']()
          let d = $('#employeeTbody tr:visible').length
          e.html($(`<h5>${d} employees / ${t}</h5>`))
        })
  }),
  $('#select-locations').on('change', function () {
    $('#select-departments option').each(function () {
      if (this.defaultSelected) return (this.selected = !0), !1
    })
    let e = $('#total-entries'),
      t = $('#employeeTbody tr').length
    e.html($(`<h5>${t} employees</h5>`))
    let a = $('#select-locations :selected').text()
    $('table')[a ? 'show' : 'hide'](),
      a &&
        $.each($('#employeeTable tbody tr'), function (o, n) {
          $(n)[$(n).is(':contains(' + a + ')') ? 'show' : 'hide']()
          let d = $('#employeeTbody tr:visible').length
          e.html($(`<h5>${d} employees / ${t}</h5>`))
        })
  })
let backToTop = $('.back-to-top')
if (backToTop) {
  const e = () => {
    window.scrollY > 100 ? backToTop.addClass('active') : backToTop.removeClass('active')
  }
  $(window).scroll(e)
}
