import requests
import sys
import json
from datetime import datetime

class ValentineAPITester:
    def __init__(self, base_url="https://heartlinks-2.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.session_token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.valentine_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None, use_cookies=True):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if headers:
            test_headers.update(headers)
        
        # Use cookies for auth instead of Authorization header
        cookies = {}
        if self.session_token and use_cookies:
            cookies['session_token'] = self.session_token
        elif self.session_token and not use_cookies:
            test_headers['Authorization'] = f'Bearer {self.session_token}'

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, cookies=cookies)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, cookies=cookies)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, cookies=cookies)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    print(f"   Response: {response.json()}")
                except:
                    print(f"   Response: {response.text}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def setup_test_user(self):
        """Create test user and session using MongoDB"""
        print("\n🔧 Setting up test user...")
        
        # Generate test data
        timestamp = int(datetime.now().timestamp())
        self.user_id = f"test-user-{timestamp}"
        self.session_token = f"test_session_{timestamp}"
        
        # MongoDB commands to create test user and session
        mongo_commands = f"""
mongosh --eval "
use('test_database');
var userId = '{self.user_id}';
var sessionToken = '{self.session_token}';
db.users.insertOne({{
  user_id: userId,
  email: 'test.user.{timestamp}@example.com',
  name: 'Test User {timestamp}',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
}});
db.user_sessions.insertOne({{
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
}});
print('✅ Test user created successfully');
"
        """
        
        import subprocess
        try:
            result = subprocess.run(mongo_commands, shell=True, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ Test user created - ID: {self.user_id}")
                print(f"✅ Session token: {self.session_token}")
                return True
            else:
                print(f"❌ Failed to create test user: {result.stderr}")
                return False
        except Exception as e:
            print(f"❌ Error creating test user: {str(e)}")
            return False

    def test_templates(self):
        """Test template endpoints"""
        success, response = self.run_test(
            "Get Templates",
            "GET",
            "templates",
            200,
            use_cookies=False  # Templates endpoint doesn't require auth
        )
        
        if success and isinstance(response, list):
            expected_templates = ['runaway_no', 'emotional_damage', 'guilt_trip', 'puppy_eyes', 'destiny_mode']
            found_templates = [t.get('template_id') for t in response]
            
            for template in expected_templates:
                if template in found_templates:
                    print(f"   ✅ Found template: {template}")
                else:
                    print(f"   ❌ Missing template: {template}")
                    
            return len(expected_templates) == len([t for t in expected_templates if t in found_templates])
        
        return success

    def test_auth_flow(self):
        """Test authentication endpoints"""
        # Test /auth/me with session token
        success, user_data = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if success and user_data.get('user_id') == self.user_id:
            print(f"   ✅ User authenticated: {user_data.get('name')}")
            return True
        else:
            print(f"   ❌ Auth failed - Expected user_id: {self.user_id}, got: {user_data.get('user_id')}")
            return False

    def test_valentine_crud(self):
        """Test valentine CRUD operations"""
        # Create valentine
        valentine_data = {
            "template_id": "runaway_no",
            "from_name": "Test Sender",
            "to_name": "Test Receiver",
            "message": "Will you be my Valentine? This is a test message!",
            "emoji_style": "cute",
            "background_theme": "pink"
        }
        
        success, response = self.run_test(
            "Create Valentine",
            "POST",
            "valentines",
            200,
            data=valentine_data
        )
        
        if success and response.get('valentine_id'):
            self.valentine_id = response['valentine_id']
            print(f"   ✅ Valentine created: {self.valentine_id}")
            
            # Test get user valentines
            success2, valentines = self.run_test(
                "Get User Valentines",
                "GET",
                "valentines",
                200
            )
            
            if success2 and isinstance(valentines, list) and len(valentines) > 0:
                print(f"   ✅ Found {len(valentines)} valentines")
                
                # Test get specific valentine
                success3, valentine = self.run_test(
                    "Get Valentine by ID",
                    "GET",
                    f"valentines/{self.valentine_id}",
                    200
                )
                
                if success3 and valentine.get('valentine_id') == self.valentine_id:
                    print(f"   ✅ Valentine retrieved successfully")
                    return True
                    
        return False

    def test_payment_flow(self):
        """Test payment endpoints"""
        if not self.valentine_id:
            print("❌ No valentine ID available for payment test")
            return False
            
        # Test create payment order
        payment_data = {
            "valentine_id": self.valentine_id,
            "amount": 15,
            "currency": "INR"
        }
        
        success, response = self.run_test(
            "Create Payment Order",
            "POST",
            "payment/create-order",
            200,
            data=payment_data
        )
        
        if success and response.get('order_id'):
            print(f"   ✅ Payment order created: {response['order_id']}")
            return True
            
        return False

    def test_response_recording(self):
        """Test valentine response recording"""
        if not self.valentine_id:
            print("❌ No valentine ID available for response test")
            return False
            
        response_data = {
            "response": "yes"
        }
        
        success, response = self.run_test(
            "Record Valentine Response",
            "POST",
            f"valentines/{self.valentine_id}/response",
            200,
            data=response_data
        )
        
        if success:
            print(f"   ✅ Response recorded successfully")
            
            # Verify response was saved
            success2, valentine = self.run_test(
                "Verify Response Saved",
                "GET",
                f"valentines/{self.valentine_id}",
                200
            )
            
            if success2 and valentine.get('response') == 'yes':
                print(f"   ✅ Response verified in database")
                return True
                
        return False

    def cleanup_test_data(self):
        """Clean up test data"""
        print("\n🧹 Cleaning up test data...")
        
        mongo_cleanup = f"""
mongosh --eval "
use('test_database');
db.users.deleteMany({{user_id: '{self.user_id}'}});
db.user_sessions.deleteMany({{user_id: '{self.user_id}'}});
db.valentines.deleteMany({{user_id: '{self.user_id}'}});
print('✅ Test data cleaned up');
"
        """
        
        import subprocess
        try:
            subprocess.run(mongo_cleanup, shell=True, capture_output=True, text=True)
            print("✅ Test data cleaned up")
        except Exception as e:
            print(f"⚠️  Cleanup warning: {str(e)}")

def main():
    print("🚀 Starting Valentine API Tests...")
    print("=" * 50)
    
    tester = ValentineAPITester()
    
    # Setup test user
    if not tester.setup_test_user():
        print("❌ Failed to setup test user, stopping tests")
        return 1
    
    # Run tests
    tests = [
        ("Templates", tester.test_templates),
        ("Authentication", tester.test_auth_flow),
        ("Valentine CRUD", tester.test_valentine_crud),
        ("Payment Flow", tester.test_payment_flow),
        ("Response Recording", tester.test_response_recording)
    ]
    
    for test_name, test_func in tests:
        print(f"\n📋 Running {test_name} Tests...")
        try:
            test_func()
        except Exception as e:
            print(f"❌ {test_name} test failed with error: {str(e)}")
    
    # Cleanup
    tester.cleanup_test_data()
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())