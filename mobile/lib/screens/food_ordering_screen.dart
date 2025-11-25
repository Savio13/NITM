import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';

class FoodOrderingScreen extends StatefulWidget {
  const FoodOrderingScreen({super.key});

  @override
  State<FoodOrderingScreen> createState() => _FoodOrderingScreenState();
}

class _FoodOrderingScreenState extends State<FoodOrderingScreen> {
  DateTime? _orderDate;
  String? _pickupOrDelivery = 'pickup';
  final Set<String> _selectedItems = {};
  bool _isLoading = false;

  final List<Map<String, String>> _menuItems = [
    {'name': 'Breakfast Combo', 'id': 'item_breakfast'},
    {'name': 'Lunch Thali', 'id': 'item_lunch'},
    {'name': 'Veg Biryani', 'id': 'item_veg_biryani'},
    {'name': 'Chicken Curry', 'id': 'item_chicken'},
    {'name': 'Dal Makhani', 'id': 'item_dal'},
    {'name': 'Paneer Butter Masala', 'id': 'item_paneer'},
  ];

  Future<void> _selectOrderDate(BuildContext context) async {
    final picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 30)),
    );
    if (picked != null && picked != _orderDate) {
      setState(() => _orderDate = picked);
    }
  }

  Future<void> _submitOrder() async {
    if (_orderDate == null || _selectedItems.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a date and at least one item')),
      );
      return;
    }

    setState(() => _isLoading = true);
    try {
      final authProvider = Provider.of<AuthProvider>(context, listen: false);
      await authProvider.post('/food-orders', {
        'date': _orderDate?.toIso8601String(),
        'items': _selectedItems.toList(),
        'pickupOrDelivery': _pickupOrDelivery,
      });
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Food order submitted')),
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
      appBar: AppBar(title: const Text('Order Food')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Select Order Date', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ElevatedButton(
              onPressed: () => _selectOrderDate(context),
              child: Text(_orderDate == null ? 'Select Date' : '${_orderDate?.toLocal().toString().split(' ')[0]}'),
            ),
            const SizedBox(height: 24),
            Text('Select Items', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            ..._menuItems.map((item) {
              return CheckboxListTile(
                title: Text(item['name']!),
                value: _selectedItems.contains(item['id']),
                onChanged: (value) {
                  setState(() {
                    if (value == true) {
                      _selectedItems.add(item['id']!);
                    } else {
                      _selectedItems.remove(item['id']);
                    }
                  });
                },
              );
            }).toList(),
            const SizedBox(height: 24),
            Text('Delivery Option', style: Theme.of(context).textTheme.titleMedium),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: RadioListTile<String>(
                    title: const Text('Pickup'),
                    value: 'pickup',
                    groupValue: _pickupOrDelivery,
                    onChanged: (value) => setState(() => _pickupOrDelivery = value),
                  ),
                ),
                Expanded(
                  child: RadioListTile<String>(
                    title: const Text('Delivery'),
                    value: 'delivery',
                    groupValue: _pickupOrDelivery,
                    onChanged: (value) => setState(() => _pickupOrDelivery = value),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            ElevatedButton(
              onPressed: _isLoading ? null : _submitOrder,
              style: ElevatedButton.styleFrom(minimumSize: const Size.fromHeight(50)),
              child: _isLoading ? const CircularProgressIndicator() : const Text('Place Order'),
            ),
          ],
        ),
      ),
    );
  }
}
