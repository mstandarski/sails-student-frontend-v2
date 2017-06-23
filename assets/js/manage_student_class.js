(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=student_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getStudentClass(record_id){
    return $.get("http://localhost:1337/student_class/" + record_id, function(data){
      console.log("got Student Class");
    })
  }

  $(function(){


    $('#student_class_table').DataTable(
        {
         dom: 'Bfrtip',
         buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
         ],

         colReorder:true,

         "scrollX": true,
        //  columnDefs: [
        //    {width:'20%', targets:7}
        //  ]


       });



//this guy adds error messages if people break my rules on my forms.
// var validator =  $("#manageAssignmentForm").validate({
//     errorClass: "text-danger",
//     rules: {
//       grade_id: {
//         required: true
//       },
//       assignment_nbr: {
//         required: true,
//     },
//     messages: {
//       grade_id: {
//         required: "Enter the Grade ID!!!",
//       },
//       assignment_nbr: {
//         required: "Enter the Assignment Number!!!",
//       }
//     }
//   }
//   });


    //initialize variables for items in the DOM we will work with
    let manageStudentClassForm = $("#manageStudentClassForm");
    let addStudentClassButton = $("#addStudentClassButton");

    //add StudentClass button functionality
    addStudentClassButton.click(function(){
      $("input").val("");
      validate.resetForm();
      manageStudentClassForm.attr("action", "/create_student_class");
      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })

  	$("#student_class_table").on("click", "#editButton", function(e){
      let recordId = $(this).data("student_class_id")

      manageStudentClassForm.find("input[name=student_class_id]").val(recordId);
      manageStudentClassForm.attr("action", "/update_student_class");
      let studentClass = getStudentClass(recordId);

      //populate form when api call is done (after we get student to edit)
      studentClass.done(function(data){
        $.each(data, function(name, val){
            var $el = $('[name="'+name+'"]'),
                type = $el.attr('type');

            switch(type){
                case 'checkbox':
                    $el.attr('checked', 'checked');
                    break;
                case 'radio':
                    $el.filter('[value="'+val+'"]').attr('checked', 'checked');
                    break;
                default:
                    $el.val(val);
            }
        });
      })

      manageStudentClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageStudentClassForm.submit()
          }
        }
      });
    })


    $("#student_class_table").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("student_class_id")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete studentClass": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
