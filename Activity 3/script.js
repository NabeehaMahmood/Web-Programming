$(document).ready(function() {
    var STORAGE_KEY = 'todo-items-v1';
    var items = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    function saveItems() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        renderItems();
    }

    function renderItems() {
        var $list = $('#todo-list');
        $list.empty();
        for (var i = 0; i < items.length; i++) {
            var it = items[i];

            var $li = $('<li>').attr('data-id', it.id);
            if (it.completed) $li.addClass('completed');

            var $left = $('<div>').addClass('left');
            var $chk = $('<input type="checkbox" class="toggle">').prop('checked', it.completed);
            var $label = $('<span>').addClass('label').text(it.text);
            $left.append($chk).append($label);

            var $actions = $('<div>').addClass('actions');
            var $edit = $('<button>').addClass('edit-btn').text('Edit');
            var $remove = $('<button>').addClass('remove-btn').text('Remove');
            $actions.append($edit).append($remove);

            $li.append($left).append($actions);
            $list.append($li);
        }

        var remaining = 0;
        for (var j = 0; j < items.length; j++) { if (!items[j].completed) remaining++; }
        $('#remaining').text(remaining);
    }

    $('#add-btn').on('click', function() {
        var text = $('#new-item').val().trim();
        if (!text) return;
        items.push({ id: Date.now().toString(), text: text, completed: false });
        $('#new-item').val('');
        saveItems();
    });

    $('#new-item').on('keydown', function(e) { if (e.which === 13) { $('#add-btn').click(); } });

    $('#todo-list').on('change', '.toggle', function() {
        var id = $(this).closest('li').attr('data-id');
        for (var k = 0; k < items.length; k++) {
            if (items[k].id === id) { items[k].completed = this.checked; break; }
        }
        saveItems();
    });

    $('#todo-list').on('click', '.remove-btn', function() {
        var id = $(this).closest('li').attr('data-id');
        for (var m = 0; m < items.length; m++) {
            if (items[m].id === id) { items.splice(m, 1); break; }
        }
        saveItems();
    });

    $('#todo-list').on('click', '.edit-btn', function() {
        var $li = $(this).closest('li');
        var id = $li.attr('data-id');
        var index = -1;
        for (var n = 0; n < items.length; n++) { if (items[n].id === id) { index = n; break; } }
        if (index === -1) return;

        var $label = $li.find('.label');
        var old = $label.text();
        var $input = $('<input type="text" class="edit-input">').val(old);
        $label.replaceWith($input);
        $input.focus();

        $input.on('blur', function() {
            var val = $(this).val().trim();
            if (val) items[index].text = val;
            saveItems();
        });

        $input.on('keydown', function(e) { if (e.which === 13) { $(this).blur(); } });
    });

    // Filters removed: show all items by default

    $('#clear-completed').on('click', function() {
        var newItems = [];
        for (var p = 0; p < items.length; p++) { if (!items[p].completed) newItems.push(items[p]); }
        items = newItems;
        saveItems();
    });

    renderItems();
});