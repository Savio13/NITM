import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class RoomBookingScreen extends StatefulWidget {
  const RoomBookingScreen({super.key});

  @override
  State<RoomBookingScreen> createState() => _RoomBookingScreenState();
}

class _RoomBookingScreenState extends State<RoomBookingScreen> {
  DateTime? _checkInDate;
  DateTime? _checkOutDate;
  String? _selectedRoom;
  String? _purpose;
  bool _isLoading = false;

  final List<String> _availableRooms = ['Room 101', 'Room 102', 'Room 103', 'Room 201', 'Room 202'];

  Future<void> _selectCheckInDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _checkInDate) {
      setState(() => _checkInDate = picked);
    }
  }

  Future<void> _selectCheckOutDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: _checkInDate ?? DateTime.now(),
      firstDate: _checkInDate ?? DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _checkOutDate) {
      setState(() => _checkOutDate = picked);
    }
  }

  Future<void> _submitBooking() async {
    if (_checkInDate == null || _checkOutDate == null || _selectedRoom == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all fields')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.post('/bookings', {
        'type': 'GUESTROOM',
        'itemId': _selectedRoom,
        'startAt': _checkInDate?.toIso8601String(),
        'endAt': _checkOutDate?.toIso8601String(),
        'details': {'purpose': _purpose ?? 'Official stay'}
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Room booking request submitted')),
        );
        Navigator.pop(context);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Book Room')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select Room', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _selectedRoom,
              hint: const Text('Choose a room'),
              isExpanded: true,
              items: _availableRooms.map((room) {
                return DropdownMenuItem(value: room, child: Text(room));
              }).toList(),
              onChanged: (value) => setState(() => _selectedRoom = value),
            ),
            const SizedBox(height: 24),
            Text('Check-In Date', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => _selectCheckInDate(context),
              child: Text(_checkInDate == null ? 'Select Date' : '${_checkInDate?.toLocal().toString().split(' ')[0]}'),
            ),
            const SizedBox(height: 24),
            Text('Check-Out Date', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => _selectCheckOutDate(context),
              child: Text(_checkOutDate == null ? 'Select Date' : '${_checkOutDate?.toLocal().toString().split(' ')[0]}'),
            ),
            const SizedBox(height: 24),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Purpose (optional)',
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => setState(() => _purpose = value),
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _isLoading ? null : _submitBooking,
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
              child: _isLoading ? const CircularProgressIndicator() : const Text('Submit Booking'),
            ),
          ],
        ),
      ),
    );
  }
}
