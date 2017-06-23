(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of class id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getClass(record_id){
    return $.get("http://localhost:1337/class/" + record_id, function(data){
      console.log("got class");
    })
  }

  $(function(){


    $('#classTable').DataTable(
        {
         dom: 'Bfrtip',
         buttons: [
             'copy', 'csv', 'excel', 'pdf', 'print'
         ],

         colReorder:true,

         "scrollX": true,
         columnDefs: [
           {width:'20%', targets:3}
         ]


       });



//this guy adds error messages if people break my rules on my forms.
let validate = $("#manageClassForm").validate({
     errorClass: "text-danger",
     rules: {
       instructor_id: {
         required: true
       },
       subject: {
         required: true
        //  minlength: 2
       },
       course: {
         required: true
       }
     },
     messages: {
    student_id: {
      // required: "Assignment number needed",
      // dateISO: jQuery.validator.format("Must be more than one letter!")
    },
    instructor_id: {
      required: "You need to fill this in!",
    },
    subject: {
      required: "This is a required field",
    },
    course: {
      required: "Fill this in, or none shall pass",
    }
  }

});



    //initialize variables for items in the DOM we will work with
    let manageClassForm = $("#manageClassForm");
    let addClassButton = $("#addClassButton");

    //add class button functionality
    addClassButton.click(function(){
      $("input").val("");
      // $("#last_name").val("");
      // $("#start_date").val("");
      validate.resetForm();
      manageClassForm.attr("action", "/create_class");
      manageClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })

  	$("#classTable").on("click", "#editButton", function(e){
      let recordId = $(this).data("classid")
      manageClassForm.find("input[name=class_id]").val(recordId);
      manageClassForm.attr("action", "/update_class");
      let currentClass = getClass(recordId);

      //populate form when api call is done (after we get class to edit)
      currentClass.done(function(data){
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

      manageClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageClassForm.submit()
          }
        }
      });
    })


    $("#classTable").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("classid")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete Class": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
