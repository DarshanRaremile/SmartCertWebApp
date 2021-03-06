import { Component, OnInit } from '@angular/core';
import { ColorsService } from '../services/colors';
import { RestCallsComponent } from '../services/httpServices';
import { Router } from '@angular/router';
import { NotificationService } from "../services/notificatationService";

declare var $: any;
declare var swal: any;
declare var approve: any;
declare var httpCalls: RestCallsComponent;

@Component({
  selector: 'create-checker',
  templateUrl: './create-checker.html',
  providers: [ColorsService]
})

export class CreateCheckerComponent implements OnInit {

  constructor( private colorsService: ColorsService,
               private httpCalls: RestCallsComponent, 
               private route: Router,
               private notify:NotificationService) {
  }
  universityUsers:any = {};
  flag = 0;
  myData: any[];
  selectedUniv: any = {};

  createUniversityUser(universityUser) {
    universityUser.universityId=this.selectedUniv._id;
    universityUser.universityName=this.selectedUniv.name;
    universityUser.universityObjectId=this.selectedUniv._id;
    universityUser.role="2";
    universityUser.roleName="Checker";
    universityUser.url = this.selectedUniv.universityUrl
    console.log("sending Http Calls");
    console.log(JSON.stringify(universityUser));
    this.httpCalls.createUniversityUser(universityUser).subscribe(
      (response) => {
        var temp = response.json();
        if(temp.status == -1)
          this.notify.errorNotification();
        else if(temp.status == -2)
          this.notify.loginNotification();
        else
          this.route.navigate(['users/checker-component']);
      },
      (error) => {
        console.log(error);
        this.notify.errorNotification();
      });
  }

SubmitUniversityUser(checker: any) {
swal({
  title: 'Create Checker',
  text: 'Are you sure you want to create the Checker ' + checker.name,
  type: "info",
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, create it!',
  cancelButtonText: 'No!',
  confirmButtonClass: 'confirm-class',
  cancelButtonClass: 'cancel-class',
  closeOnConfirm: false,
  closeOnCancel: false,
},  function(isConfirm) {
      if (isConfirm) {
          swal({
              title: 'Success!',
              text: 'Checker created!',
              confirmButtonText: 'Ok!',
              closeOnConfirm: true
          }, function() {
            this.createUniversityUser(checker);
          }.bind(this));

      } else {
          swal("Cancelled", "No new checker created:)", "error");
      }
  }.bind(this));
};

cancelProcess(): void {
swal({
  title: 'Do you want to cancel?',
  text: 'All the changes will be reverted!',
  type: "warning",
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, cancel it!',
  cancelButtonText: 'No!',
  confirmButtonClass: 'confirm-class',
  cancelButtonClass: 'cancel-class',
  closeOnConfirm: false,
  closeOnCancel: false,
},  function(isConfirm) {
      if (isConfirm) {
          swal({
              title: 'Changes reverted!',
              text: 'Redirecting back to home...',
              timer: 1000,
              showConfirmButton: false
          }, function() {
            this.route.navigate(['users/checker-component']);
          }.bind(this));

      } else {
          swal("Cancelled", "Cancellation averted!", "error");
      }
  }.bind(this));
};

  ngOnInit()
   {
     //--------------------------------------------
     this.httpCalls.getUniversity().subscribe(
       (response) => {
         console.log('Got university data');
         if(!response.json().status)
           this.myData = response.json();
         else{
           this.myData = [];
           if(response.json().status===-1)
             this.notify.errorNotification();
           else
             this.notify.loginNotification();
         }
       },
       (error) => {
         console.log("error");
         this.notify.errorNotification();
       });
     console.log("Checker Page");
     //---------------------------------------------
    $('[data-approve-field]').on('change', function(e) {
      var field = $(this).attr('data-approve-field');
      var title = $(this).attr('data-approve-title');
      var required = $(this).attr('data-approve-required') === 'true' ? true : false;
      var success = $(this).attr('data-approve-success');
      var error = $(this).attr('data-approve-error');
      var target = $(this).attr('data-approve-target');
      this.validateOnChange('[data-approve-field="' + field + '"]', {
        title: title,
        required: required
      }, success, error);
      console.log(field, title, required, success, error, target);
    });
    //firstname
    this.validateOnChange('#universityUsersName-0', {
      title: 'University Name',
      required: true
    }, 'Name is valid', 'Please enter a valid Name');
    //lastname
    this.validateOnChange('#universityUsersUniversityNumber-0', {
      title: 'University Number',
      required: true
    }, 'University is valid', 'Please select a valid University');

    this.validateOnChange('#designation-0', {
      title: 'Designation',
      required: true
    }, 'Designation is valid', 'Please enter a valid designation');
    this.validateOnChange('#employeeId-0', {
      title: 'employeeId',
      required: true
    }, 'Employee Id is valid', 'Please enter a valid Employee Id');

    this.validateOnChange('#contactNumber-0', {
      title: 'Contact Number',
      numeric: true,
      range: {
        min: 10,
        max: 12
      }
    }, 'Contact Number is valid', 'Please enter a valid Contact Number between 10-12 characters');

    this.validateOnChange('#emailId-0', {
      title: 'Email Id',
      email: true
    }, 'Email Id is valid', 'Enter a valid email id');
    //
    this.validateOnChange('#password-0', {
      title: 'Password',
      required: true
    }, 'Password provided!', 'Please enter a valid password');

    $('.go-back').on('click', function(e) {
      e.preventDefault();
      var target = $(this).attr('data-target');
      $(target).trigger('click');
      return false;
    });
    $('#step-0').submit(function(e) {
      e.preventDefault();
      var fields = [];
      $('#step-0 .form-control').each(function() {
        $(this).focus().blur();
        fields.push($(this).attr('data-valid') === "true" ? true : false);
      });
      if (fields.includes(false)) {
        $('#steps .tab-0').trigger('click');
        $('#steps .tab-1').addClass('disabled');
        // $('#steps .tab-2').addClass('disabled');
        return false;
      }
      $('#steps .tab-1').removeClass('disabled').trigger('click');
      return false;
    });
  }

  isError(element, message) {
    var el = $(element);
    el.parent().removeClass('has-success').addClass('has-danger');
    el.removeClass('form-control-success').addClass('form-control-danger');
    el.next().text(message).removeClass('text-success').addClass('text-danger');
    el.attr('data-valid', false);
  }

  isSuccess(element, message) {
    var el = $(element);
    el.parent().removeClass('has-danger').addClass('has-success');
    el.removeClass('form-control-danger').addClass('form-control-success');
    el.next().text(message).removeClass('text-danger').addClass('text-success');
    el.attr('data-valid', true);
  }

  resetMessages(element) {
    var el = $(element);
    el.parent().removeClass('has-danger').removeClass('has-success');
    el.removeClass('form-control-danger').removeClass('form-control-success');
    el.next().text('');
  }

  validateOnChange(element, rules, successMessage, errorMessage) {
    var self = this;
    $(document).on('focus', element, function(e) {
      e.preventDefault();
      //resetMessages(element);
      return false;
    });
    $(document).on('blur', element, function(e) {
      e.preventDefault();
      var result = approve.value($(element).val(), rules);
      if (result.approved) {
        self.isSuccess(element, successMessage);
        console.log('Self: '+ self);
      } else {
        self.isError(element, errorMessage);
        console.log('Self: '+ self);
      }
      return false;
    })
  }
}
