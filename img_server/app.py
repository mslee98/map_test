from flask import Flask, send_file
from flask_restx import Api, Resource
import os

app = Flask(__name__)
api = Api(app)


@api.route('/kepcogis/<string:z>/<int:x>/<int:y>.png')
class gis_rest(Resource):
    def get(self,z,x,y):

        #image_path = f"D:\\x08aseMap_SD\\L{z}\\{x}\\{y}.png"

        z_str = str(z)

        image_path = os.path.join("D:", "baseMap_SD", str(z_str), str(x), f"{y}.png")

        print("image_path : ",image_path)

        return send_file(image_path, mimetype='image/png')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port= 9042)
