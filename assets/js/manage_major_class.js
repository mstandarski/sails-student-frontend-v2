(function(){

  //function to delete record by settin id on form and then submitting the form
  //sets value of student id in hidden delete form and submits form
  //not completely ideal but wanted to take advantage of flash messages in sails
  function deleteRecord(record_id){
    $("#deleteform input[name=major_class_id]").val(record_id);
    $("#deleteform").submit();
  }

  function getMajorClass(record_id){
    return $.get("http://localhost:1337/major_class/" + record_id, function(data){
      console.log("got Major Class");
    })
  }

  $(function(){


    $('#major_class_table').DataTable(
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
    let validate = $("#manageMajorClassForm").validate({
         errorClass: "text-danger",
         rules: {
           first_name: {
             required: true,
             minlength: 2
           },
           last_name: {
             required: true,
             minlength: 2
           },
           start_date: {
             required: true,
             dateISO: true,
             date: true
           }
         },
         messages: {
        first_name: {
          required: "This is a required field",
          dateISO: jQuery.validator.format("Must be more than one letter!")
        },
        last_name: {
          required: "This is a required field",
          dateISO: jQuery.validator.format("Must be more than one letter!")
        },
        start_date: {
          required: "This is a required field",
          dateISO: jQuery.validator.format("Date must be formated yyyy-mm-dd!")
        }
      }

    });



    //initialize variables for items in the DOM we will work with
    let manageMajorClassForm = $("#manageMajorClassForm");
    let addMajorClassButton = $("#addMajorClassButton");

    //add MajorClass button functionality
    addMajorClassButton.click(function(){
      $("input").val("");
      validate.resetForm();
      manageMajorClassForm.attr("action", "/create_major_class");
      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Submit": function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })

  	$("#major_class_table").on("click", "#editButton", function(e){
      let recordId = $(this).data("major_class_id")
      manageMajorClassForm.find("input[name=major_class_id]").val(recordId);
      manageMajorClassForm.attr("action", "/update_major_class");
      let majorClass = getMajorClass(recordId);

      //populate form when api call is done (after we get student to edit)
      majorClass.done(function(data){
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

      manageMajorClassForm.dialog({
        title: "Add Record",
        width: 700,
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          Submit: function() {
            //function to delete record
            manageMajorClassForm.submit()
          }
        }
      });
    })


    $("#major_class_table").on("click", "#deleteButton", function(e){
      let recordId = $(this).data("major_class_id")
      $("#deleteConfirm").dialog({
        title: "Confirm Delete",
        modal: true,
        buttons: {
          Cancel: function() {
            $( this ).dialog( "close" );
          },
          "Delete majorClass": function() {
            //function to delete record
            deleteRecord(recordId);
          }
        }
      });
    })

  })

})();
