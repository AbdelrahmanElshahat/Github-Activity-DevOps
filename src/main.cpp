#include"Github_activity.h"

int main(){
    Github_activity github;
    std::string username;
    std::cout<<"Enter the username: ";
    std::cin>>username;
    github.setUserName(username);
    github.get_activity();
    github.user_activity();
}