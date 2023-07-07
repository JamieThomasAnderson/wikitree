# wikitree
WikiTree is a simple prototype web app built in React and Nodejs that helps visualise how Wikipedia articles interconnect via a graph view. Representing each Wikipedia article is a node - representing hyperlinks are edges. The side panel allows the user to view the page of the corresponding selected node. 

The graph is filled by beginning with a starting link. The backend parses that starting link page, collecting all the connecting articles. We then go to each sub-page and do the same. While we could increase to any depth, this significantly increases the graph size, decreasing performance. The emerging interconnection between topics comes when we add multiple origin pages to the graph. We can then easily spot the bridging concepts relating to both starting pages.

![image](https://github.com/JamieThomasAnderson/wikitree/assets/96888832/9584833d-ec99-4734-b470-07b63474e585)
![image](https://github.com/JamieThomasAnderson/wikitree/assets/96888832/cd01c594-b5f8-403c-9380-20caa6f0afb4)

# Setup

Download & Install  
 - [Node.js](https://nodejs.org/en) (Version 18 or above)
 - [Docker](https://www.docker.com/getting-started)

```
git clone https://github.com/JamieThomasAnderson/wikitree.git
cd wikitree
```

Build the Docker images and start the containers:
```
docker-compose up --build
```

Note: If you are making changes to the Dockerfile or the dependencies in your package.json, you will need to rebuild the images using the command above. Otherwise, to start the containers, use:

```
docker-compose up
```

Visit http://localhost:3000 to view the application in your browser.

# License

This project is licensed under the MIT License. This means that you are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, under the conditions that you include the original copyright notice and disclaimers.

Please see the LICENSE.md file in the repository for full details.
