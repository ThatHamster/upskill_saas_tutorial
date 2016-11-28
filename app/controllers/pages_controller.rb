class PagesController < ApplicationController
  # GET request for '/' which is our homepage
  def home
    @basic_plan = Plan.find(1)
    @pro_plan = Plan.find(2)
  end
  
  # GET request for '/about' which is our about page
  def about
  end
end