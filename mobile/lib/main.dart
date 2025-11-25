import 'package:flutter/material.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'NITM Mobile',
      home: Scaffold(
        appBar: AppBar(title: const Text('NITM Mobile')),
        body: const Center(child: Text('Welcome to NITM mobile app skeleton')),
      ),
    );
  }
}
