from flask import Flask, request, jsonify
from flask_cors import CORS
import promptpay

app = Flask(__name__)
CORS(app)

@app.route('/api/deposit', methods=['POST'])
def deposit():
    try:
        data = request.json
        amount = float(data.get('amount', 0))
        # ใส่เบอร์พร้อมเพย์ของคุณตรงนี้
        payload = promptpay.generate_payload("0991233114", amount)
        return jsonify({"qr_code": payload})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

