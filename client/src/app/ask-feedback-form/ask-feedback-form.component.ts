import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {getFormControlError} from '../get-form-control-error';
import {AuthService} from '../services/auth.service';
import {FeedbackRequest} from '../model/feedbackRequest';
import {GraphqlService} from '../services/graphql/graphql.service';

@Component({
  selector: 'app-ask-feedback-form',
  templateUrl: './ask-feedback-form.component.html',
  styleUrls: ['./ask-feedback-form.component.css'],
})
export class AskFeedbackFormComponent {
  userEmail?: string;
  userName?: string;
  loading: boolean = false;
  testEmail: string = 'test@exemple.com';
  testName: string = 'test';
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private graphqlService: GraphqlService,
  ) {
    const user = this.authService.getUserDetails();
    this.userEmail = user?.email!;
    this.userName = user?.displayName!;
    graphqlService.loading.subscribe((loading)=> {
      this.loading = loading;
    });
  }

  private queryParams = this.activatedRoute.snapshot.queryParamMap;
  public getFormControlError = getFormControlError;

  public form = new FormGroup({
    receverEmail: new FormControl(this.queryParams.get('receverEmail'), [
      Validators.required,
      Validators.email,
    ]),
    receverName: new FormControl(
        this.queryParams.get('receverName'),
        Validators.required,
    ),
    message: new FormControl(''),
  });

  get senderEmail() {
    return this.form.get('senderEmail');
  }

  get senderName() {
    return this.form.get('senderName');
  }

  get receverEmail() {
    return this.form.get('receverEmail');
  }

  get receverName() {
    return this.form.get('receverName');
  }

  get message() {
    return this.form.get('message');
  }

  async onSubmit() {
    const token = await this.authService.getUserTokenId();
    const feedback = new FeedbackRequest(
      token!,
      this.userName ? this.userName : this.testEmail,
      this.userEmail ? this.userEmail : this.testName,
      this.receverName?.value,
      this.receverEmail?.value,
      this.message?.value,
    );
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.graphqlService.askFeedback(feedback);
    }
  }
}
