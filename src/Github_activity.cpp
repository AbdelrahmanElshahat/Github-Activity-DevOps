#include"Github_activity.h"

Github_activity::Github_activity() {
    curl = curl_easy_init();
}
Github_activity::~Github_activity() {
    curl_slist_free_all(headers);
    curl_easy_cleanup(curl);
}
void Github_activity::setUserName(std::string username) {
    this->username = username;
}
std::string Github_activity::getUserName(std::string username) {
    return username;
}
std::string Github_activity::getURL(std::string username) {
    return "https://api.github.com/users/" + username + "/events";
}
 size_t Github_activity::WriteCallback(void* contents, size_t size, size_t nmemb, void* userp) {
    ((std::string*)userp)->append((char*)contents, size * nmemb);
    return size * nmemb;
}
void Github_activity::get_activity(){
     if (curl) {
        
        headers = curl_slist_append(headers, "User-Agent: Mozilla/5.0");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);
        curl_easy_setopt(curl, CURLOPT_URL, getURL(username).c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &readBuffer);
        res = curl_easy_perform(curl);
    }
}
void Github_activity::user_activity(){
    if(res != CURLE_OK){
        std::cerr<<"curl_easy_perform failed "<<curl_easy_strerror(res)<<std::endl;
    }else
    {
        try
        {
            events = json::parse(readBuffer);
            std::string date;
            for(const auto &event : events){
                std::string type = event["type"];
                std::string repo = event["repo"]["name"];
                if (type == "PushEvent")
                {
                    date = event["created_at"];
                    int commitCount = event["payload"]["commits"].size();
                    std::cout<<"pushed "<<commitCount <<" commit"<<(commitCount>1?"s":"")<<" to "<<repo<<"  "<<date<<std::endl;
                }else if (type == "IssuesEvent")
                {
                    std::string action = event["payload"]["action"];
                    if(action == "opened"){
                        std::cout<<"opened issue in "<<repo<<"  "<<date<<std::endl;
                    }
                }else if (type == "WatchEvent")
                {
                    std::cout<<"Stared "<<repo<<"  "<<date<<std::endl;
                }else if (type =="CreateEvent")
                {
                    std::cout<<"created "<<repo<<"  "<<date<<std::endl;
                }
                else if (type == "PullRequestEvent")
                {
                    std::cout<<"pullRequest "<<repo<<"  "<<date<<std::endl;
                }else if (type == "ForkEvent")
                {
                    std::cout<<"forked " <<repo<<"  "<<date<<std::endl;
                }

            }
        }
        catch(const std::exception& e)
        {
            std::cerr <<"json parse error:"<< e.what() << '\n';
        }
        
    }
    
}