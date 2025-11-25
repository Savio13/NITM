import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class VehicleBookingScreen extends StatefulWidget {
  const VehicleBookingScreen({super.key});

  @override
  State<VehicleBookingScreen> createState() => _VehicleBookingScreenState();
}

class _VehicleBookingScreenState extends State<VehicleBookingScreen> {
  DateTime? _tripDate;
  String? _selectedVehicle;
  String? _purpose;
  String? _destination;
  bool _isLoading = false;

  final List<String> _availableVehicles = ['Car-001', 'Car-002', 'Van-001', 'Bus-001'];

  Future<void> _selectTripDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (picked != null && picked != _tripDate) {
      setState(() => _tripDate = picked);
    }
  }

  Future<void> _submitBooking() async {
    if (_tripDate == null || _selectedVehicle == null || _destination == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.post('/bookings', {
        'type': 'VEHICLE',
        'itemId': _selectedVehicle,
        'startAt': _tripDate?.toIso8601String(),
        'details': {'purpose': _purpose ?? 'Official visit', 'destination': _destination}
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Vehicle booking request submitted')),
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
      appBar: AppBar(title: const Text('Book Vehicle')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select Vehicle', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            DropdownButton<String>(
              value: _selectedVehicle,
              hint: const Text('Choose a vehicle'),
              isExpanded: true,
              items: _availableVehicles.map((vehicle) {
                return DropdownMenuItem(value: vehicle, child: Text(vehicle));
              }).toList(),
              onChanged: (value) => setState(() => _selectedVehicle = value),
            ),
            const SizedBox(height: 24),
            Text('Trip Date', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => _selectTripDate(context),
              child: Text(_tripDate == null ? 'Select Date' : '${_tripDate?.toLocal().toString().split(' ')[0]}'),
            ),
            const SizedBox(height: 24),
            TextField(
              decoration: const InputDecoration(
                labelText: 'Destination *',
                border: OutlineInputBorder(),
              ),
              onChanged: (value) => setState(() => _destination = value),
            ),
            const SizedBox(height: 16),
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
