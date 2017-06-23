(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of instructor id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=instructor_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getInstructor(record_id){
    return $.get("http://localhost:1337/instructor/" + record_id, function(data){
      console.log("got instructor");
    })
  }

  $(function(){


    $('#instructorTable').DataTable(
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
let validate = $("#manageInstructorForm").validate({
     errorClass: "text-danger",
     rules: {
       first_name: {
         required: true
       },
       last_name: {
         required: true
        //  minlength: 2
       },
       major_id: {
         required: true
       },
       years_of_experience: {
         required: true
       },
       tenured: {
         required: true
       }
     },
     messages: {
    student_id: {
      // required: "Assignment number needed",
      // dateISO: jQuery.validator.format("Must be more than one letter!")
    },
    first_name: {
      required: "I need me a name.",
    },
    last_name: {
      required: "This is a required field",
    },
    major_id: {
      required: "Fill this in, or none shall pass",
    },
    years_of_experience: {
      required: "This is needed",
    },
    tenured: {
      required: "input a 1 or 2",
    }
  }

});



    //initialize variables for items in the DOM we will work with
    let manageInstructorForm = $("#manageInstructorForm");
    let addInstructorButton = $("#addInstructorButton");

    //add instructor button functionality
    addInstructorButton.click(function(){
      $("input").val("");
      validate.resetForm();
      manageInstructorForm.attr("action", "/create_instructor");
      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })

  	$("#instructorTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("instructorid")
      manageInstructorForm.find("input[name=instructor_id]").val(recordId);
      manageInstructorForm.attr("action", "/update_instructor");
      let instructor = getInstructor(recordId);

      //populate form when api call is done (after we get instructor to edit)
      instructor.done(function(data){
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

      manageInstructorForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageInstructorForm.submit()
          }
        }
      });
    })


    $("#instructorTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("instructorid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Instructor": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
