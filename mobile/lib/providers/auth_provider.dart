import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:convert';
import '../models/user.dart';

class AuthProvider extends ChangeNotifier {
  static const String _baseUrl = 'http://localhost:4000';
  static const String _tokenKey = 'auth_token';
  static const String _userKey = 'auth_user';

  String? _token;
  User? _user;

  String? get token => _token;
  User? get user => _user;
  bool get isLoggedIn => _token != null;

  AuthProvider() {
    _loadFromStorage();
  }

  Future<void> _loadFromStorage() async {
    final prefs = await SharedPreferences.getInstance();
    _token = prefs.getString(_tokenKey);
    final userJson = prefs.getString(_userKey);
    if (userJson != null) {
      _user = User.fromJson(jsonDecode(userJson));
    }
    notifyListeners();
  }

  Future<void> login(String email, String password) async {
    final response = await http.post(
      Uri.parse('$_baseUrl/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      _token = data['accessToken'];
      _user = User.fromJson(data['user']);

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(_tokenKey, _token!);
      await prefs.setString(_userKey, jsonEncode(data['user']));

      notifyListeners();
    } else {
      throw Exception('Login failed: ${response.body}');
    }
  }

  Future<void> logout() async {
    _token = null;
    _user = null;
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_userKey);
    notifyListeners();
  }

  Future<dynamic> get(String endpoint) async {
    if (_token == null) throw Exception('Not authenticated');
    final response = await http.get(
      Uri.parse('$_baseUrl$endpoint'),
      headers: {'Authorization': 'Bearer $_token'},
    );
    if (response.statusCode == 401) {
      await logout();
      throw Exception('Session expired');
    }
    if (response.statusCode != 200) throw Exception('Request failed');
    return jsonDecode(response.body);
  }

  Future<dynamic> post(String endpoint, Map<String, dynamic> body) async {
    if (_token == null) throw Exception('Not authenticated');
    final response = await http.post(
      Uri.parse('$_baseUrl$endpoint'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $_token',
      },
      body: jsonEncode(body),
    );
    if (response.statusCode == 401) {
      await logout();
      throw Exception('Session expired');
    }
    if (response.statusCode >= 400) throw Exception('Request failed: ${response.body}');
    return jsonDecode(response.body);
  }
}
