#include <iostream>
#include <nlohmann/json.hpp>
#include <curl/curl.h>
using json = nlohmann::json;
class Github_activity {
    public:
        Github_activity();
        std::string getUserName(std::string username);
        std::string getURL(std::string username);
        ~Github_activity();
        void setUserName(std::string username);
        void get_activity();
        void user_activity();
    private:
    // Add headers for GitHub API
        struct curl_slist* headers = NULL;
        static size_t WriteCallback(void* contents, size_t size, size_t nmemb, void* userp);
        CURL* curl;
        CURLcode res;
        std::string readBuffer;
        json events;
        std::string username;
};