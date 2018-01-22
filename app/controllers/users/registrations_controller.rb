class Users::RegistrationsController < Devise::RegistrationsController
  before_eaction :select_plan, only: :new
  
  # Extend default devise gem behavior
  # so that users signing up with pro account (Plan ID 2)
  # save with a special strip subscription function
  # otherwise devise signs up user as usual
  def create
    super do |resource|
      if params[:plan]
        resource.plan_id = params[:plan]
        if resource.plan_id == 2
          resource.save_with_subscription\
        else
          resource.save
        end
      end
    end
  end
  
  # Checks to make sure plan is not set to another id outside of Basic(1) or Pro(2)
  private
    def select_plan
      unless (params[:plan] == '1' || params[:plan] == '2')
        flash[:notice] = "Please select a membership plan to sign up."
        redirect_to root_url
      end
    end
end